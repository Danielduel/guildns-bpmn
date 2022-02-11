import React, {useContext} from 'react';
import styled from "styled-components";
/*
*/
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

function App() {
  const context = useContext(AppContext);

  React.useEffect(() => {
    if (context.viewer && context.newDiagramRaw) {
      context.viewer?.importXML(context.newDiagramRaw);
    }
  }, [context.viewer, context.newDiagramRaw])

  return (
    <div className="App">
      <DiagramMenu />
      <StyledCanvas id={bpmnViewerCanvasId}></StyledCanvas>
    </div>
  );
}

export default App;
