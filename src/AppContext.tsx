import React, {ReactChild} from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import BpmnModeler from "bpmn-js/lib/Modeler";
import EmbeddedComments from "bpmn-js-embedded-comments";
import newDiagramUrl from "./mock/newDiagram.bpmn";

const defaultAppContext = {
  viewer: null as BpmnViewer | null,
  newDiagramRaw: null as string | null
};

export const AppContext = React.createContext(defaultAppContext);
type AppContextProviderProps = {
  children: ReactChild;
};
export type AppType = "modeler" | "viewer";

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
        additionalModules: [ EmbeddedComments ]
      });
      setViewer(_viewer);
    }, [setViewer])

    return (
      <AppContext.Provider value={{
        viewer,
        newDiagramRaw
      }}>
        {children}
      </AppContext.Provider>
    );
  };

  return AppContextProvider;
}

