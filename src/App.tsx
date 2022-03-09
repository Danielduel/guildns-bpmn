import React, { useContext } from "react";
import styled from "styled-components";
import { DiagramMenu } from "./DiagramMenu";
import { AppContext } from "./AppContext";

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
  const { saveCurrentDiagram, diagramMenuOpen } = useContext(AppContext);

  return (
    <div className="App">
      <StyledCanvas id={bpmnViewerCanvasId}></StyledCanvas>
      {diagramMenuOpen && <DiagramMenu />}
      <StyledDebugButton onClick={saveCurrentDiagram}></StyledDebugButton>
    </div>
  );
}

export default App;
