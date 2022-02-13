import React, {useContext} from 'react';
import styled from "styled-components";
import {DiagramMenu} from './DiagramMenu';
import {AppContext} from './AppContext';

const bpmnViewerCanvasId = "bpmnViewerCanvasId";
const StyledCanvas = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

const StyledDebugButton = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  background-color: green;
  width: 80px;
  height: 80px;
`;

function App() {
  const context = useContext(AppContext);

  React.useEffect(() => {
    const isAppLoaded = (
      context.viewer &&
      context.newDiagramRaw &&
      context.storage.current &&
      context.storageStatus.current
    );
    if (!isAppLoaded) return;
    
    context.storage.current?.getContents("Test diagram")
      .then((data) => {
        const diagram = data as string; // typings, hello?

        if (!diagram) {
          console.log("Loaded new diagram");
          context.viewer?.importXML(context.newDiagramRaw)
        } else {
          console.log("Loaded saved diagram");
          context.viewer?.importXML(diagram);
        }
      })


  }, [context.viewer, context.newDiagramRaw, context.storage])

  return (
    <div className="App">
      <DiagramMenu />
      <StyledDebugButton onClick={() => context.saveCurrentDiagram()} />
      <StyledCanvas id={bpmnViewerCanvasId}></StyledCanvas>
    </div>
  );
}

export default App;
