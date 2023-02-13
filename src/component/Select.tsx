import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SelectOption, SelectProps } from '../types';

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const clearOptions = (): void => {
    if (multiple) {
      onChange([]);
      return;
    }
    onChange(undefined);
  };
  const selectOption = (option: SelectOption): void => {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((val) => val !== option));
      } else {
        onChange([...value, option]);
      }
    } else if (option !== value) onChange(option);
  };
  const isOptionSelected = (option: SelectOption): boolean => {
    return multiple ? value.includes(option) : option === value;
  };
  useEffect(() => {
    if (!isOpen) setHighlightedIndex(0);
  }, [isOpen]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        default:
          break;
      }
    };
    containerRef.current?.addEventListener('keydown', handler);
    const r = containerRef.current;
    return () => r?.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, highlightedIndex, options]);
  return (
    <Wrapper
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <span className="value">
        {multiple
          ? value.map((v) => (
              <button
                type="button"
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className="option-badge"
              >
                {v.label}
                <span className="remove-btn">&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        type="button"
        className="clear-btn"
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
      >
        &times;
      </button>
      <div className="divider" />
      <div className="caret" />
      <ul className={isOpen ? 'options show' : 'options'}>
        {options.map((option, index) => {
          return (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`${isOptionSelected(option) ? 'option selected' : 'option '} ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};
const Wrapper = styled.div.attrs({
  tabIndex: 0,
})`
  position: relative;
  width: 20em;
  min-height: 1.5em;
  border: 0.05em solid #777;
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  border-radius: 0.25em;
  outline: none;
  :focus {
    border-color: hsl(200, 100%, 50%);
  }
  .value {
    flex-grow: 1;
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
  }
  .clear-btn {
    background: none;
    color: #777;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 1.25em;
    :focus,
    :hover {
      color: #333;
    }
  }
  .divider {
    background-color: #777;
    align-self: stretch;
    width: 0.05em;
  }
  .caret {
    translate: 0 25%;
    border: 0.25em solid transparent;
    border-top-color: #777;
    cursor: pointer;
  }
  .options {
    position: absolute;
    margin: 0;
    padding: 0;
    list-style: none;
    display: none;
    max-height: 15em;
    overflow-y: auto;
    border: 0.05em solid #777;
    border-radius: 0.25em;
    width: 100%;
    left: 0;
    top: calc(100% + 0.25em);
    background-color: white;
    z-index: 100;
  }
  .options.show {
    display: block;
  }
  .option {
    padding: 0.25em 0.5em;
    cursor: pointer;
  }

  .option.selected {
    background-color: hsl(200, 100%, 70%);
  }

  .option.highlighted {
    background-color: hsl(200, 100%, 50%);
    color: white;
  }

  .option-badge {
    display: flex;
    align-items: center;
    border: 0.05em solid #777;
    border-radius: 0.25em;
    padding: 0.15em 0.25em;
    gap: 0.25em;
    cursor: pointer;
    background: none;
    outline: none;
    :hover,
    :focus {
      background-color: hsl(0, 100%, 90%);
      border-color: hsl(0, 100%, 50%);
    }
    .remove-btn {
      :hover,
      :focus {
        color: hsl(0, 100%, 50%);
      }
      font-size: 1.25em;
      color: #777;
    }
  }
`;

export default Select;
