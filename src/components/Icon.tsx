/* eslint-disable @next/next/no-img-element -- Static SVG files, no optimisation needed. */
// Colored icons. Most come from Flat Color Icons (icons8, MIT), copied to
// /runtime/icons by scripts/build-assets.mjs; the set lacks a few school tools,
// which are drawn in the same style under /icons.
const own = [
  'textmarker', 'radierer', 'geodreieck', 'pipette', 'filzstift', 'fueller',
  'buntstift', 'pinsel', 'farbeimer', 'seiten', 'schere', 'drehen', 'zuschneiden', 'balken',
] as const;
export const flatIcons = [
  'about', 'add_image', 'alarm_clock', 'approval', 'audio_file', 'binoculars',
  'bookmark', 'businesswoman', 'calculator', 'calendar', 'camcorder_pro',
  'camera', 'cancel', 'checkmark', 'clapperboard', 'clock', 'collaboration',
  'collect', 'comments', 'conference_call', 'cursor', 'diploma_1', 'document',
  'doughnut_chart', 'down', 'edit_image', 'electronics', 'empty_trash', 'expand', 'faq',
  'clear_filters', 'file', 'filing_cabinet', 'filled_filter', 'film_reel', 'flash_on', 'flow_chart', 'folder',
  'frame', 'gallery', 'globe', 'graduation_cap', 'grid', 'headset', 'high_priority',
  'home', 'idea', 'import', 'kindle', 'landscape', 'leave', 'left', 'library',
  'like', 'link', 'list', 'lock', 'mind_map', 'minus', 'music', 'next', 'night_landscape',
  'ok', 'old_time_camera', 'opened_folder', 'org_unit', 'overtime', 'paid',
  'panorama', 'picture', 'planner', 'plus', 'podium_with_speaker', 'positive_dynamic',
  'previous', 'print', 'privacy', 'puzzle', 'questions', 'radar_plot', 'reading',
  'reading_ebook', 'redo', 'remove_image', 'right', 'rotate_to_landscape',
  'rotate_to_portrait', 'ruler', 'rules', 'search', 'serial_tasks', 'settings',
  'share', 'shop', 'signature', 'sound_recording_copyright', 'speaker',
  'sports_mode', 'stack_of_photos', 'start', 'survey', 'switch_camera',
  'synchronize', 'template', 'timeline', 'todo_list', 'touchscreen_smartphone',
  'tree_structure', 'undo', 'unlock', 'up', 'video_projector',
  'voice_presentation', 'workflow',
] as const;
export type IconName = (typeof own)[number] | (typeof flatIcons)[number];

export function iconSource(name: IconName) {
  return (own as readonly string[]).includes(name)
    ? `/icons/${name}.svg`
    : `/runtime/icons/${name}.svg`;
}

export default function Icon({
  name,
  size = 28,
  className = '',
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <img
      className={`icon ${className}`}
      src={iconSource(name)}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
    />
  );
}
