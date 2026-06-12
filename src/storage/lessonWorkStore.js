const databaseName = 'jspdf-visual-lessons';
const databaseVersion = 1;
const storeName = 'lessonWork';

function isIndexedDbAvailable() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openLessonWorkDatabase() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDbAvailable()) {
      reject(new Error('IndexedDB is not available.'));
      return;
    }

    const request = window.indexedDB.open(databaseName, databaseVersion);

    request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB.'));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: 'lessonId' });
      }
    };
  });
}

function runLessonWorkTransaction(mode, callback) {
  return openLessonWorkDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        let requestResult;

        transaction.oncomplete = () => {
          database.close();
          resolve(requestResult);
        };
        transaction.onerror = () => {
          database.close();
          reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
        };
        transaction.onabort = () => {
          database.close();
          reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
        };

        requestResult = callback(store);
      }),
  );
}

export async function readLessonWorkEntries() {
  try {
    const entries = await runLessonWorkTransaction('readonly', (store) => {
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error ?? new Error('Could not read lesson work.'));
        request.onsuccess = () => resolve(request.result);
      });
    });

    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    console.warn('Could not read lesson work from IndexedDB.', error);
    return [];
  }
}

export async function saveLessonWorkEntry(entry) {
  try {
    await runLessonWorkTransaction('readwrite', (store) => {
      store.put({
        ...entry,
        updatedAt: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.warn('Could not save lesson work to IndexedDB.', error);
  }
}
