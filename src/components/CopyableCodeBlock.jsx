import { useEffect, useRef, useState } from 'react';

function fallbackCopyText(value) {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus({ preventScroll: true });
  textArea.select();
  const didCopy = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!didCopy) {
    throw new Error('Copy command was not accepted.');
  }
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (error) {
      console.warn('Clipboard API failed. Falling back to textarea copy.', error);
    }
  }

  fallbackCopyText(value);
}

function CopyableCodeBlock({ code, copyLabel = 'Copy code' }) {
  const [copyState, setCopyState] = useState('idle');
  const timeoutRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  function selectCodeText() {
    const codeElement = codeRef.current;

    if (!codeElement) {
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(codeElement);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function handleCopy() {
    try {
      await copyText(code);
      setCopyState('copied');
    } catch (error) {
      console.error(error);
      selectCodeText();
      setCopyState('selected');
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopyState('idle');
    }, 1400);
  }

  const isCopied = copyState === 'copied';
  const isError = copyState === 'error';
  const isSelected = copyState === 'selected';
  const stateLabel = isCopied
    ? 'Copied'
    : isSelected
      ? 'Code selected'
      : isError
        ? 'Copy failed'
        : copyLabel;

  return (
    <div
      className={`copyableCodeBlock ${isCopied ? 'isCopied' : ''} ${
        isSelected ? 'isSelected' : ''
      } ${isError ? 'isError' : ''}`}
    >
      <button
        type="button"
        className="copyCodeButton"
        onClick={handleCopy}
        aria-label={stateLabel}
        title={stateLabel}
      >
        <span className="copyCodeIcon" aria-hidden="true" />
        <span className="copyCodeText">{isCopied ? 'Copied' : isSelected ? 'Selected' : 'Copy'}</span>
      </button>
      <pre>
        <code ref={codeRef}>{code}</code>
      </pre>
    </div>
  );
}

export default CopyableCodeBlock;
