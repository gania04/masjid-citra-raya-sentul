const fs = require('fs');

let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// 1. Remove the invert hack
code = code.replace(/style=\{isDarkMode \? \{\} : \{ filter: 'invert\(1\) hue-rotate\(180deg\)', background: '#fff' \}\}/g, '');
code = code.replace(/<style>\{!isDarkMode \? 'img, video, \.no-invert \{ filter: invert\(1\) hue-rotate\(180deg\); \}' : ''\}<\/style>/g, '');

// 2. Replace Backgrounds
code = code.replace(/bg-slate-950/g, 'bg-slate-50');
code = code.replace(/bg-slate-900\/80/g, 'bg-white/90');
code = code.replace(/bg-slate-900/g, 'bg-white');
code = code.replace(/bg-slate-800\/50/g, 'bg-slate-100/50');
code = code.replace(/bg-slate-800\/30/g, 'bg-slate-50');
code = code.replace(/bg-slate-800/g, 'bg-slate-100');

code = code.replace(/bg-\[#0f172a\]/g, 'bg-white');
code = code.replace(/bg-\[#1e3a8a\]/g, 'bg-lime-50/50');
code = code.replace(/bg-\[#1e293b\]/g, 'bg-slate-100');
code = code.replace(/bg-\[#172554\]/g, 'bg-white');
code = code.replace(/bg-blue-900\/40/g, 'bg-lime-50');
code = code.replace(/bg-blue-900\/50/g, 'bg-lime-100/50');
code = code.replace(/bg-blue-950\/50/g, 'bg-white');
code = code.replace(/bg-blue-800\/50/g, 'bg-lime-100/50');

// 3. Replace Borders
code = code.replace(/border-slate-800/g, 'border-slate-200');
code = code.replace(/border-slate-700/g, 'border-slate-300');
code = code.replace(/border-blue-800\/50/g, 'border-lime-200');
code = code.replace(/border-blue-800/g, 'border-lime-200');
code = code.replace(/border-blue-700\/50/g, 'border-lime-200');
code = code.replace(/border-blue-900/g, 'border-slate-200');
code = code.replace(/divide-slate-800\/50/g, 'divide-slate-200');
code = code.replace(/divide-slate-800/g, 'divide-slate-200');
code = code.replace(/divide-blue-900\/50/g, 'divide-slate-200');

// 4. Text Colors
code = code.replace(/text-slate-200/g, 'text-slate-700');
code = code.replace(/text-slate-300/g, 'text-slate-600');
code = code.replace(/text-slate-400/g, 'text-slate-500');
code = code.replace(/text-blue-200/g, 'text-slate-600');
code = code.replace(/text-blue-300/g, 'text-slate-500');

code = code.replace(/text-white/g, 'text-slate-800');

// Accents (make them slightly darker for readability on light backgrounds)
code = code.replace(/text-lime-400/g, 'text-lime-600');
code = code.replace(/text-amber-400/g, 'text-amber-600');
code = code.replace(/text-emerald-400/g, 'text-emerald-600');
code = code.replace(/text-blue-400/g, 'text-blue-600');
code = code.replace(/text-red-400/g, 'text-red-600');
code = code.replace(/text-purple-400/g, 'text-purple-600');

// 5. Restore specific text-white for filled buttons
code = code.replace(/text-slate-800 font-bold py/g, 'text-white font-bold py'); // standard buttons
code = code.replace(/text-slate-800 px-3/g, 'text-white px-3'); // small buttons
code = code.replace(/text-slate-800 px-4/g, 'text-white px-4'); // med buttons
code = code.replace(/bg-lime-600 rounded-lg flex items-center justify-center font-bold text-slate-800/g, 'bg-lime-600 rounded-lg flex items-center justify-center font-bold text-white'); // DKM logo
code = code.replace(/bg-lime-600 hover:bg-lime-700 text-slate-800/g, 'bg-lime-600 hover:bg-lime-700 text-white');
code = code.replace(/bg-slate-800 hover:bg-slate-700 text-slate-800/g, 'bg-slate-100 hover:bg-slate-200 text-slate-800');
code = code.replace(/bg-red-600 hover:bg-red-700 text-slate-800/g, 'bg-red-600 hover:bg-red-700 text-white');

// Display TV mode should stay dark, so we revert anything inside `if (showDisplayTV)` if possible.
// Or we can just leave it since the display TV doesn't use many tailwind classes replaced above (it uses bg-black, text-white mostly).
code = code.replace(/text-slate-800 mb-6 tracking-wider/g, 'text-white mb-6 tracking-wider'); // TV Title
code = code.replace(/text-\[120px\] md:text-\[180px\] font-bold text-slate-800/g, 'text-[120px] md:text-[180px] font-bold text-white'); // TV Time
code = code.replace(/active \? 'text-white' : 'text-slate-700'/g, 'active ? \'text-white\' : \'text-slate-300\'');

// Inputs styling
code = code.replace(/focus:border-lime-500/g, 'focus:border-lime-600');
code = code.replace(/border border-lime-500\/20/g, 'border border-lime-600/30');

// Make the active Tab use bg-white
code = code.replace(/bg-lime-900\/40/g, 'bg-white shadow-sm border border-slate-200');
code = code.replace(/border-b-4 transition-colors border-lime-600/g, 'border-b-4 transition-colors border-lime-500 text-lime-600');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log("Theme updated to Light Premium with Lime accents!");
