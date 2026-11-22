'use client';
// Every setting is a row of buttons with icon and text – no drop-down menus.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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

/**
 * A compact choice for the bottom bar: one button with the caption above shows
 * the current option (icon and text); tapping it opens a small panel above with
 * all options as buttons. Not a drop-down: options keep icon and text.
 */
export function ChoiceMenu<T extends string | number | boolean>({
  label,
  options,
  value,
  onChange,
  disabled,
  face,
  extra,
}: {
  label: string;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  /** Shown on the button instead of the current option (e.g. when none fits). */
  face?: { icon: ChoiceIcon; label: string };
  /** More controls at the end of the panel, e.g. a colour field. */
  extra?: ReactNode;
}) {
  const current = options.find((o) => o.value === value);
  const shown = face || current || { icon: 'settings' as ChoiceIcon, label: '–' };
  return (
    <MenuButton label={label} icon={shown.icon} text={shown.label} disabled={disabled}>
      {(close) => (
        <>
          {options.map((o) => (
            <ChoiceButton
              key={String(o.value)}
              icon={o.icon}
              label={o.label}
              title={o.title}
              pressed={value === o.value}
              onClick={() => {
                onChange(o.value);
                close();
              }}
            />
          ))}
          {extra}
        </>
      )}
    </MenuButton>
  );
}

/** Captioned button that opens a panel with any content above it. */
export function MenuButton({
  label,
  icon,
  text,
  disabled,
  children,
}: {
  label: string;
  icon: ChoiceIcon;
  text: string;
  disabled?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ left: number; bottom: number } | null>(null);
  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const r = button.current.getBoundingClientRect();
    const width = panel.current?.offsetWidth || 0;
    setPlace({
      left: Math.max(8, Math.min(window.innerWidth - width - 8, r.left)),
      bottom: window.innerHeight - r.top + 6,
    });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener('pointerdown', away, true);
    window.addEventListener('keydown', key, true);
    return () => {
      window.removeEventListener('pointerdown', away, true);
      window.removeEventListener('keydown', key, true);
    };
  }, [open]);
  return (
    <div className="option-group">
      <span className="option-caption" aria-hidden="true">
        {label}
      </span>
      <div className="option-row">
        <button
          ref={button}
          type="button"
          className="choice choice-menu"
          aria-label={`${label}: ${text}`}
          aria-haspopup="true"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          <span className="choice-icon">{renderIcon(icon)}</span>
          <span className="choice-label">{text}</span>
          <Icon name="up" size={14} />
        </button>
      </div>
      {open &&
        createPortal(
          <div
            ref={panel}
            className="choice-panel"
            role="group"
            aria-label={label}
            style={place ? { left: place.left, bottom: place.bottom } : { visibility: 'hidden' }}
          >
            <span className="option-caption" aria-hidden="true">
              {label}
            </span>
            <div className="choice-panel-row">{children(() => setOpen(false))}</div>
          </div>,
          document.body,
        )}
    </div>
  );
}
