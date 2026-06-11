function ConsolePanel({ entry }) {
  if (!entry) {
    return null;
  }

  return (
    <section className={`consolePanel ${entry.type}`} aria-live="polite">
      <p className="consoleLabel">Console</p>
      <p>{entry.message}</p>
    </section>
  );
}

export default ConsolePanel;
