import type { PlaytestLog } from "./playtest-log.ts";

type LogData = PlaytestLog["data"];

// The host archives every entry, outside localStorage's small synchronous quota.
// Entries are append-only; saves write only the new tail and current recorder metadata.
export async function openLogStorage() {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("eyes.rewrite.playtest.v1", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("entries", { keyPath: "sequence" });
      request.result.createObjectStore("metadata");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  database.onversionchange = () => database.close();
  let savedSequence = 0;
  return {
    load: () =>
      new Promise<LogData | null>((resolve, reject) => {
        const transaction = database.transaction(["entries", "metadata"]);
        const metadata = transaction.objectStore("metadata").get("log");
        const entries = transaction.objectStore("entries").getAll();
        transaction.oncomplete = () => {
          const data = metadata.result as Omit<LogData, "entries"> | undefined;
          savedSequence = data?.sequence ?? 0;
          resolve(data ? { ...data, entries: entries.result } : null);
        };
        transaction.onabort = () => reject(transaction.error);
      }),
    save: (data: LogData) =>
      new Promise<void>((resolve, reject) => {
        const { entries, ...metadata } = data;
        const sequence = data.sequence;
        const transaction = database.transaction(["entries", "metadata"], "readwrite");
        const store = transaction.objectStore("entries");
        for (const entry of entries) if (entry.sequence > savedSequence) store.put(entry);
        transaction.objectStore("metadata").put(metadata, "log");
        transaction.oncomplete = () => {
          savedSequence = sequence;
          resolve();
        };
        transaction.onabort = () => reject(transaction.error);
      }),
    close: () => database.close(),
  };
}
