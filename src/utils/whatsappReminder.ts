/**
 * Utility for WhatsApp Donation Reminder Integration
 * Handles phone formatting, message templates, WhatsApp App launching, and WA Gateway API calls.
 */

export interface WaReminderPayload {
  nama: string;
  phone: string;
  tanggal: string;
  nominal?: string;
  programName?: string;
  linkDonasi?: string;
}

/**
 * Format Indonesian phone number to international WhatsApp format (e.g. 62812xxxx)
 */
export const formatWaPhone = (phone: string): string => {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }
  return clean;
};

/**
 * Build a structured, professional WhatsApp donation reminder message
 */
export const generateWaReminderMessage = ({
  nama,
  tanggal,
  nominal = 'Rp 100.000',
  programName = 'Infaq & Shadaqah Rutin Jamaah',
  linkDonasi = window.location.origin
}: WaReminderPayload): string => {
  const currentMonthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  
  return (
    `Assalamu'alaikum Wr. Wb. *${nama || 'Jamaah Muhsinin'}* 🕌\n\n` +
    `*PENGINGAT DONASI RUTIN - MASJID CITRA SENTUL RAYA*\n` +
    `---------------------------------------------------\n` +
    `Hari ini (Tanggal ${tanggal} ${currentMonthName}) adalah jadwal rutin donasi ZISWAF Anda.\n\n` +
    `💰 *Target Donasi:* ${nominal}\n` +
    `📌 *Program:* ${programName}\n\n` +
    `Mari tunaikan niat mulia Anda hari ini melalui Portal Resmi Jamaah Masjid Citra Sentul Raya:\n` +
    `🔗 ${linkDonasi}\n\n` +
    `_Jazakumullah Khairan Katsiran. Semoga Allah SWT senantiasa memberkahi rezeki, kesehatan, dan keluarga Anda. Aamiin._ 🤲`
  );
};

/**
 * Open the official WhatsApp application (Mobile or Desktop) with pre-filled message
 */
export const triggerWaApp = (payload: WaReminderPayload): boolean => {
  const cleanPhone = formatWaPhone(payload.phone);
  const message = generateWaReminderMessage(payload);
  const encodedText = encodeURIComponent(message);

  if (!cleanPhone) {
    alert('Nomor WhatsApp belum diset atau tidak valid. Silakan perbarui nomor WhatsApp di profil Anda.');
    return false;
  }

  // Construct direct WhatsApp URL (works for Mobile WA App, WA Web, and WA Desktop)
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  // Open in new tab/window which automatically opens the WhatsApp app on device
  const win = window.open(waUrl, '_blank');
  if (!win) {
    // Fallback if popup is blocked
    window.location.href = waUrl;
  }
  return true;
};

/**
 * Send WhatsApp message directly via WA Gateway API (e.g., Fonnte API)
 * If no token is configured, falls back to direct WA App launcher.
 */
export const sendWaViaGateway = async (
  payload: WaReminderPayload,
  apiToken?: string
): Promise<{ success: boolean; method: 'gateway' | 'app'; message: string }> => {
  const token = apiToken || localStorage.getItem('masjid_wa_gateway_token') || '';
  const cleanPhone = formatWaPhone(payload.phone);
  const message = generateWaReminderMessage(payload);

  if (token && cleanPhone) {
    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          target: cleanPhone,
          message: message,
        }),
      });

      const resData = await response.json();
      if (resData.status) {
        return {
          success: true,
          method: 'gateway',
          message: `Pesan WA berhasil terkirim secara otomatis via Gateway ke WhatsApp jamaah (${cleanPhone}).`,
        };
      }
    } catch (err) {
      console.warn('WA Gateway error, falling back to direct app launcher:', err);
    }
  }

  // Fallback to launching WhatsApp App directly on device
  const launched = triggerWaApp(payload);
  return {
    success: launched,
    method: 'app',
    message: launched
      ? `Aplikasi WhatsApp berhasil dibuka! Pesan pengingat telah disiapkan di HP/Aplikasi WA (${cleanPhone}).`
      : 'Gagal membuka WhatsApp. Periksa nomor kontak Anda.',
  };
};

/**
 * Request permission for native device push notifications (Mobile & Desktop HP)
 */
export const requestDeviceNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    alert('Browser / Perangkat Anda belum mendukung push notification native.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  alert('Izin notifikasi ditolak oleh browser. Silakan izinkan notifikasi di pengaturan browser/HP Anda.');
  return false;
};

/**
 * Trigger native device push notification on Android / iOS / Desktop status bar
 */
export const triggerDeviceNotification = async (payload: WaReminderPayload): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  const hasPermission = await requestDeviceNotificationPermission();
  if (!hasPermission) return false;

  try {
    const title = '🕌 Pengingat Donasi Masjid Citra Sentul Raya';
    const body = `Assalamu'alaikum ${payload.nama || 'Jamaah'}, hari ini (Tanggal ${payload.tanggal}) adalah jadwal rutin donasi Anda (${payload.nominal || 'Rp 100.000'}). Tap untuk tunaikan donasi.`;

    const notification = new Notification(title, {
      body,
      icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      badge: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      tag: 'donasi-reminder',
    });

    notification.onclick = () => {
      window.focus();
      triggerWaApp(payload);
    };

    return true;
  } catch (err) {
    console.error('Error firing device notification:', err);
    return false;
  }
};
