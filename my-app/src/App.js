import React, { useEffect, useState, useRef } from "react";
import './App.css';
import Editor from '@monaco-editor/react';

function App() {
    const editorRef = useRef(null);
    const consolaRef = useRef(null);

    const [archivos, setArchivos] = useState([]); // Estado para mantener los archivos
    const [archivoActual, setArchivoActual] = useState(null); // Estado para mantener el archivo actual

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

    
    function abrirArchivo(nombre) {
        const archivo = archivos.find(a => a.nombre === nombre);
        if (archivo) {
            setArchivoActual(archivo);
            editorRef.current.setValue(archivo.contenido);
        }
    }

    function guardarArchivo ()  {
        const contenido = editorRef.current.getValue();
        const blob = new Blob([contenido], { type: 'text/plain' });
        const fecha = new Date().toISOString().replace(/:/g, '-');
        const nombreArchivo = `archivo_${fecha}.sc`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function arbir_archivo_nuevo(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
    
        if (!file) return;
    
        const reader = new FileReader();
    
        reader.onload = function (event) {
            const contents = event.target.result;
            editorRef.current.setValue(contents);
        };
    
        if (file.name.endsWith('.sc')) {
            reader.readAsText(file);
        } else {
            alert('Por favor, seleccione un archivo con extensión .sc');
        }
    }
    
    

    function crearArchivoEnBlanco() {
        const nombreArchivo = `NuevoArchivo${archivos.length + 1}.sc`;
        const nuevoArchivo = { nombre: nombreArchivo, contenido: "" };
        setArchivos([...archivos, nuevoArchivo]);
        setArchivoActual(nuevoArchivo);
        editorRef.current.setValue("");
    }

    
    return (
        <div className="App">
            <nav>
                <label className="logo">CompiScript+</label>
                <ul>
                    <li><a href="#" onClick={crearArchivoEnBlanco}>Crear archivo en blanco</a></li>
                    {archivos.map(archivo => (
                        <li key={archivo.nombre}><a href="#" onClick={() => abrirArchivo(archivo.nombre)}>{archivo.nombre}</a></li>
                    ))}
                    <li><label className="nav-link" htmlFor="fileInput">Abrir Archivos</label>
            <input id="fileInput" type="file" accept=".sc" style={{ display: 'none' }} onChange={arbir_archivo_nuevo} /></li>
                    <li><a href="#" onClick={guardarArchivo}>Guardar archivo</a></li>
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
                        <p>Estoy estudiando ingeniería en ciencias y sistemas, 5to semestre 2024</p>
                        <p>Contacto: jespinozajolon@gmail.com</p>
                        <p>GitHub: <a href="https://github.com/EspinozaJolon01">EspinozaJolon01</a></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
