import {openDB, DBSchema, IDBPDatabase} from "idb";

export type DiagramDataId = string;
export type DiagramMetaId = string;
type CreatedByUser<T> = {
  id: T;
  author: string;
  timestamp: number;
};

export type DiagramData_v2 = CreatedByUser<DiagramDataId> & {
  diagramMetaId: DiagramMetaId;
  xmlData: string;
};

export type DiagramMeta_v2 = CreatedByUser<DiagramMetaId> & {
  lastDiagramDataId: DiagramDataId;
  diagramName: string;
};

export interface DiagramDB extends DBSchema {
  diagramMeta_v2: {
    key: DiagramMetaId;
    value: DiagramMeta_v2;
  };
  diagramData_v2: {
    key: DiagramDataId;
    value: DiagramData_v2;
  };
};

export type StorageType = IDBPDatabase<DiagramDB>;

const upgrade = (db: IDBPDatabase<DiagramDB>) => {
  // @ts-ignore
  db.deleteObjectStore("diagramSave"); // v1 -> v2
  // @ts-ignore
  db.deleteObjectStore("diagramFile"); // v1 -> v2

  db.createObjectStore("diagramMeta_v2", {
    keyPath: "id"
  });
  db.createObjectStore("diagramData_v2", {
    keyPath: "id"
  });
};

const createStorage = () => {
  return openDB<DiagramDB>("diagramDb", 2, {
    upgrade
  });
};

export const storage = createStorage();
type P<
  MethodName extends keyof StorageType
  > = Parameters<
    StorageType[MethodName] extends (...args: any) => any
    ? StorageType[MethodName]
    : (...args: any) => any
  >;

export const storageApi = {
  get: async function (...params: P<"get">) {
    return (await storage).get(...params);
  },
  set: async function (...params: P<"put">) {
    return (await storage).put(...params);
  },
  del: async function (...params: P<"delete">) {
    return (await storage).delete(...params);
  },
  clear: async function (...params: P<"clear">) {
    return (await storage).clear(...params);
  },
  keys: async function (...params: P<"getAllKeys">) {
    return (await storage).getAllKeys(...params);
  }
};

