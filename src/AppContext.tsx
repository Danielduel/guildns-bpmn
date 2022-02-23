import React, {ReactChild} from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import BpmnModeler from "bpmn-js/lib/Modeler";
import EmbeddedComments from "bpmn-js-embedded-comments";
import {storage, DiagramDB} from "./storage";
import newDiagramUrl from "./mock/newDiagram.bpmn";
import {IDBPDatabase} from "idb";

export type AppType = "modeler" | "viewer";

const defaultAppContext = {
  viewer: null as BpmnViewer | null,
  newDiagramRaw: null as string | null,
  saveCurrentDiagram: () => {}
};

export const AppContext = React.createContext(defaultAppContext);
type AppContextProviderProps = {
  children: ReactChild;
};

export const createAppContextProvider = (appType: AppType) => {
  const BpmnMainComponent = appType === "modeler" ? BpmnModeler : BpmnViewer;

  const AppContextProvider = ({children}: AppContextProviderProps) => {
    const [viewer, setViewer] = React.useState<typeof defaultAppContext["viewer"]>(null);
    const [newDiagramRaw, setNewDiagramRaw] = React.useState<typeof defaultAppContext["newDiagramRaw"]>(null);

    React.useEffect(() => {
      fetch(newDiagramUrl as string)
        .then(res => res.blob())
        .then(blob => blob.text())
        .then(setNewDiagramRaw);
    }, [setNewDiagramRaw]);

    React.useEffect(() => {
      const _viewer = new BpmnMainComponent({
        container: "body",
        additionalModules: [EmbeddedComments]
      });
      setViewer(_viewer);
      // Since this lib doesn't provide good typings
      // (or I am too blind to find good ones)
      // binding actual viewer to window for debug purposes
      // @ts-ignore
      window._viewer = _viewer;
    }, [setViewer]);

    return (
      <AppContext.Provider value={{
        viewer,
        newDiagramRaw,
        saveCurrentDiagram: () => {}
      }}>
        {children}
      </AppContext.Provider>
    );
  };

  return AppContextProvider;
}

