'use client';
// Every setting is a row of buttons with icon and text – no drop-down menus.
import type { ReactNode } from 'react';
import Icon, { type IconName } from '../Icon';
import { FontGlyph, TextGlyph } from './Glyphs';
import { fonts } from '@/lib/notebook-model';

export type ChoiceIcon = IconName | ReactNode;
export type ChoiceOption<T> = {
  value: T;
  label: string;
  icon: ChoiceIcon;
  title?: string;
};

function renderIcon(icon: ChoiceIcon) {
  return typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon;
}

export function ChoiceButton({
  icon,
  label,
  pressed,
  disabled,
  danger,
  title,
  onClick,
}: {
  icon: ChoiceIcon;
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`choice ${danger ? 'choice-danger' : ''}`}
      aria-pressed={pressed}
      disabled={disabled}
      title={title}
      onClick={onClick}
    >
      <span className="choice-icon">{renderIcon(icon)}</span>
      <span className="choice-label">{label}</span>
    </button>
  );
}

export function Choices<T extends string | number | boolean>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <OptionGroup label={label}>
      {options.map((o) => (
        <ChoiceButton
          key={String(o.value)}
          icon={o.icon}
          label={o.label}
          title={o.title}
          disabled={disabled}
          pressed={value === o.value}
          onClick={() => onChange(o.value)}
        />
      ))}
    </OptionGroup>
  );
}

/**
 * A captioned group of options. `plain` groups wrap a single labelled field and
 * therefore get no accessible name of their own (avoids double announcements).
 */
export function OptionGroup({
  label,
  children,
  plain = false,
}: {
  label: string;
  children: ReactNode;
  plain?: boolean;
}) {
  return (
    <div className="option-group" role={plain ? undefined : 'group'} aria-label={plain ? undefined : label}>
      <span className="option-caption" aria-hidden="true">
        {label}
      </span>
      <div className="option-row">{children}</div>
    </div>
  );
}

/** A colour picker that looks like the other choices. */
export function ColorChoice({
  label,
  ariaLabel,
  value,
  onChange,
  disabled,
}: {
  label: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`choice choice-color ${disabled ? 'disabled' : ''}`}>
      <span className="choice-icon">
        <span className="swatch swatch-mix" style={{ background: value }} />
      </span>
      <span className="choice-label">{label}</span>
      <input
        type="color"
        aria-label={ariaLabel || label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/** Small number field with − and ＋ buttons. */
export function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const clamp = (n: number) =>
    Math.round(Math.max(min, Math.min(max, n)) * 100) / 100;
  return (
    <OptionGroup label={label} plain>
      <div className="stepper">
        <button
          type="button"
          aria-label={`${label} verringern`}
          disabled={disabled || value <= min}
          onClick={() => onChange(clamp(value - step))}
        >
          <Icon name="minus" size={20} />
        </button>
        <input
          type="number"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={Math.round(value * 10) / 10}
          disabled={disabled}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n) && n >= min && n <= max) onChange(n);
          }}
        />
        {unit && <span className="stepper-unit">{unit}</span>}
        <button
          type="button"
          aria-label={`${label} erhöhen`}
          disabled={disabled || value >= max}
          onClick={() => onChange(clamp(value + step))}
        >
          <Icon name="plus" size={20} />
        </button>
      </div>
    </OptionGroup>
  );
}

export type PickerOption<T> = {
  value: T;
  label: string;
  icon?: ChoiceIcon;
  title?: string;
};

/**
 * Replacement for a drop-down in dialogs: a captioned row of buttons with icon
 * and text. Without an icon, the first characters of the label are shown.
 */
export function Picker<T extends string | number>({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
  compact,
}: {
  label: string;
  /** Small buttons with icon beside the text, e.g. inside a widget on the page. */
  compact?: boolean;
  /** Accessible name of the group; defaults to the visible label. */
  name?: string;
  value: T;
  onChange: (value: T) => void;
  options: PickerOption<T>[];
  disabled?: boolean;
}) {
  return (
    <div className={`picker ${compact ? 'compact' : ''}`} role="group" aria-label={name || label}>
      <span className="picker-caption" aria-hidden="true">
        {label}
      </span>
      <div className="picker-options">
        {options.map((o) => (
          <ChoiceButton
            key={String(o.value)}
            icon={o.icon ?? <TextGlyph text={o.label.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2) || '•'} />}
            label={o.label}
            title={o.title}
            disabled={disabled}
            pressed={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
    </div>
  );
}

/** Font choice used by several learning tools. */
export function FontPicker({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (font: string) => void;
}) {
  return (
    <Picker
      label="Schrift"
      name={name}
      value={value}
      onChange={onChange}
      options={Object.entries(fonts).map(([font, label]) => ({
        value: font,
        label,
        icon: <FontGlyph font={font} />,
      }))}
    />
  );
}
