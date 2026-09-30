import {useEffect, useRef, useState} from 'react';
import {Spin} from 'antd';

interface EmojiSelectEvent {
  id: string;
  native: string;
}

interface EmojiPickerProps {
  // Вызывается с символом эмодзи, например "😀"
  onSelect: (emoji: string) => void;
}

// Обёртка над web-компонентом emoji-mart.
// @emoji-mart/react не поддерживает React 19, поэтому Picker монтируется вручную.
// Код и данные (~400 КБ) грузятся при первом открытии
export const EmojiPicker = ({onSelect}: EmojiPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const [isLoading, setIsLoading] = useState(true);

  // Picker создаётся один раз, актуальный колбэк берём из ref
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    let picker: HTMLElement | undefined;
    let cancelled = false;

    void Promise.all([import('emoji-mart'), import('@emoji-mart/data')]).then(
      ([{Picker}, {default: data}]) => {
        if (cancelled || !container) return;

        picker = new Picker({
          data,
          onEmojiSelect: ({native}: EmojiSelectEvent) =>
            onSelectRef.current(native),
          // Приложение пока только в светлой теме
          theme: 'light',
          previewPosition: 'none',
          skinTonePosition: 'search',
          autoFocus: true,
        }) as unknown as HTMLElement;

        container.appendChild(picker);
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
      picker?.remove();
    };
  }, []);

  return (
    <>
      {isLoading && <Spin />}
      <div ref={containerRef} />
    </>
  );
};
