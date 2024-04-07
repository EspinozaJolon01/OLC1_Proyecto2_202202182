

import { useEffect, useState, useRef } from "react"
import './App.css';
import Editor from '@monaco-editor/react';

function App() {


    const editorRef = useRef(null);
    const consolaRef = useRef(null);

    function handleEditorDidMount(editor, id) {
        if (id === "editor") {
        editorRef.current = editor;
        } else if (id === "consola") {
        consolaRef.current = editor;
        }
    }


    function interpretar() {
        var entrada = editorRef.current.getValue();
        fetch('http://localhost:4000/interpretar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entrada: entrada }),
        })
        .then(response => response.json())
        .then(data => {
            consolaRef.current.setValue(data.Respuesta);
        })
        .catch((error) => {
            alert("Ya no sale comp1")
            console.error('Error:', error);
        });
    }





    return (
<div className="App">
    <nav>
        <label className="logo">CompiScript+</label>
        <ul>
            <li><a href="#">Crear archivos</a></li>
            <li><a href="#">Abrir archivos</a></li>
            <li><a href="#">Guardar archivos</a></li>
            <li><a href="#" onClick={interpretar}>Ejecutar</a></li>
            <li><a href="#">Reportes</a></li>
        </ul>
    </nav>

    <div className="editors-container">
        <h1>Entrada</h1>
        <div className="editor">
            <Editor height="90vh" width="100%" defaultLanguage="java" defaultValue="" theme="vs" onMount={(editor) => handleEditorDidMount(editor, "editor")} />
        </div>

        <h1>Consola</h1>
        <div className="editor-consola">
            <Editor height="90vh" width="100%" defaultLanguage="cpp" defaultValue="" theme="vs" options={{ readOnly: true }} onMount={(editor) => handleEditorDidMount(editor, "consola")} />
        </div>
    </div>

    <footer>
        <div className="programador-info">
            
            <div>
                <h2>Luis Jolon</h2>
                <p>Estoy estudiando ingenieria en ciencias y sistemas , 5to semestre 2024</p>
                <p>Contacto: jespinozajolon@gmail.com</p>
                <p>GitHub: <a href="https://github.com/EspinozaJolon01">EspinozaJolon01</a></p>
            </div>
        </div>
    </footer>
</div>



    );
}

export default App;
