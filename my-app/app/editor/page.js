"use client";

import Canvas, {nodes } from "./canvas"
import React, { useState, useEffect, useRef } from 'react';

const FileExplorerIDE = () => {
  const [key, setKey] = useState(0);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [compileMenuOpen, setCompileMenuOpen] = useState(false);
  const [folderStructure, setFolderStructure] = useState({
    name: 'WORKSPACE',
    type: 'folder',
    expanded: true,
    children: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputRef] = useState(React.createRef());

  const [state, setState] = useState({
    mode: "mouse",
    view: "file"
  });

  const [headerCN, setHeaderCN] = useState("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors");
  const [fileCN, setFileCN] = useState("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]");

  const [mouseCN, setMouseCN] = useState("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]");
  const [addCN, setAddCN] = useState("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors");
  const [connectCN, setConnectCN] = useState("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors");

  const onHeaderClick = () => {
    console.log(0, state.view)
    if (state.view == "file") {
      setState({mode: state.mode, view: "header"})
      console.log(0, state.view)
      setHeaderCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]")
      setFileCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
    }
  }

  const onFileClick = () => {
    console.log(1, state.view)
    if (state.view == "header") {
      setState({mode: state.mode, view: "file"})
      setHeaderCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
      setFileCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]")
    }
  }

  //

  const onMouseClick = () => {
    if (state.mode == "add" || state.mode == "connect") {
      setState({view: state.view, mode: "mouse"})
      setMouseCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]")
      setAddCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
      setConnectCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
    }
  }

  const onAddClick = () => {
    if (state.mode == "mouse" || state.mode == "connect") {
      setState({view: state.view, mode: "add"})
      setAddCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]")
      setMouseCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
      setConnectCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
    }
  }

  const onConnectClick = () => {
    if (state.mode == "add" || state.mode == "mouse") {
      setState({view: state.view, mode: "connect"})
      setConnectCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors bg-[#5ea990]")
      setAddCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
      setMouseCN("p-4 border-2 border-blue-500 text-white rounded-md shadow-sm transition-colors")
    }
  }

  const toggleFileMenu = () => {
    setFileMenuOpen(!fileMenuOpen);
    if (compileMenuOpen) setCompileMenuOpen(false);
  };

  const toggleCompileMenu = () => {
    setCompileMenuOpen(!compileMenuOpen);
    if (fileMenuOpen) setFileMenuOpen(false);
  };

  const openFileExplorer = async () => {
    const dirHandle = await window.showDirectoryPicker();

    const folder = await readDirectory(dirHandle);
    setFolderStructure(folder);
    setFileMenuOpen(false);
  };

  const readDirectory = async (dirHandle) => {
    const folder = {
      name: dirHandle.name,
      type: 'folder',
      expanded: true,
      children: []
    };

    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind == 'file') {
        folder.children.push({
          name, 
          type: "file",
          fileHandle: handle
        });
      } else if (handle.kind == "directory") {
        const subFolder = await readDirectory (handle);
        folder.children.push(subFolder);
      }
    }

    folder.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return folder;
  }

  const createFile = () => {
    let indices = selectedFile.split("\n")[0].split(",");
    indices.pop();
    let folder = folderStructure;

    for (let i = 0; i < indices.length; i++) {
      folder = folder.children[indices[i]];
    }

    folder.children[folder.children.length] = {name: "Untitled.hpp", type: "file"};
    setFolderStructure(folderStructure);
    setKey(key + 1);
  }

  const deleteFile = () => {
    let indices = selectedFile.split("\n")[0].split(",");
    let folder = folderStructure;

    for (let i = 0; i < indices.length - 1; i++) {
      folder = folder.children[indices[i]];
    }

    console.log(folder)
    delete folder.children[indices[indices.length - 1]];
    console.log(folder)
    setFolderStructure(folderStructure);
    setKey(key + 1);
  }

  const handleFileSelection = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Process the selected files to create a virtual folder structure
    const fileMap = new Map();
    const rootFolder = {
      name: 'WORKSPACE',
      type: 'folder',
      expanded: true,
      children: []
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.webkitRelativePath.split('/');
      
      if (path.length <= 1) continue;
      
      let currentLevel = rootFolder;
      
      rootFolder.name = path[0];
      
      for (let j = 1; j < path.length; j++) {
        const name = path[j];
        
        if (j === path.length - 1) {
          currentLevel.children.push({
            name: name,
            type: 'file',
            file: file
          });
        } else {
          let folder = currentLevel.children.find(child => 
            child.type === 'folder' && child.name === name
          );
          
          if (!folder) {
            folder = {
              name: name,
              type: 'folder',
              expanded: true,
              children: []
            };
            currentLevel.children.push(folder);
          }
          
          currentLevel = folder;
        }
      }
    }
    
    const sortFolder = (folder) => {
      folder.children.sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
      
      folder.children.forEach(child => {
        if (child.type === 'folder') {
          sortFolder(child);
        }
      });
    };
    
    sortFolder(rootFolder);
    setFolderStructure(rootFolder);
  };

  const toggleFolder = (path) => {
    const updateFolder = (node, pathArray, index) => {
      if (index === pathArray.length) {
        return { ...node, expanded: !node.expanded };
      }
      
      if (node.type !== 'folder' || !node.children) return node;
      
      return {
        ...node,
        children: node.children.map((child, i) => {
          if (i === pathArray[index]) {
            return updateFolder(child, pathArray, index + 1);
          }
          return child;
        })
      };
    };
    
    const pathArray = path.split(',').map(p => parseInt(p));
    setFolderStructure(updateFolder(folderStructure, pathArray, 0));
  };

  const renderFileTree = (node, path = '') => {
    if (node.type === 'folder') {
      return (
        <div key={path + node.name}>
          <div 
            className="flex items-center cursor-pointer py-1" 
            onClick={() => toggleFolder(path)}
          >
            <span className="mr-1">{node.expanded ? '▼' : '▶'}</span>
            <span className="font-light">{node.name}</span>
          </div>
          {node.expanded && node.children && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2 font-light">
              {node.children.map((child, index) => renderFileTree(child, path ? `${path},${index}` : `${index}`))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div 
          key={path + node.name} 
          className={`font-light py-1 pl-4 cursor-pointer ${selectedFile === (path + "\n" + node.name) ? 'bg-blue-100' : ''}`}
          onClick={() => setSelectedFile(path + "\n" + node.name)}
        >
          {node.name}
        </div>
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete') {
        deleteFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFile]);

  return (
    <div key={key} className="flex flex-col h-screen bg-gray-50 text-gray-900">
      {/* Top Menu Bar */}
      <div className="flex border-b py-2">
        <div className="relative">
          <button 
            className="px-4 py-2 hover:bg-gray-200 text-gray-900" 
            onClick={toggleFileMenu}
          >
            File
          </button>
          {fileMenuOpen && (
            <div className="absolute top-full left-0 bg-white shadow-md border z-10 w-48">
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900"
                onClick={openFileExplorer}
              >
                Open Folder
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            className="px-4 py-2 hover:bg-gray-200 text-gray-900" 
            onClick={toggleCompileMenu}
          >
            Compile
          </button>
          {compileMenuOpen && (
            <div className="absolute top-full left-0 bg-white shadow-md border z-10 w-48">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                Compile Graph
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                Compile Selected Node
              </button>
            </div>
          )}
        </div>
        {/* Blue Buttons in the middle */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex gap-1">
            <button className={headerCN} onClick={onHeaderClick}>
            </button>
            <button className={fileCN} onClick={onFileClick}>
            </button>
          </div>
          <div className="flex gap-1">
            <button className={mouseCN} onClick={onMouseClick}>
            </button>
            <button className={addCN}  onClick={onAddClick}>
            </button>
            <button className={connectCN}  onClick={onConnectClick}>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r overflow-y-auto bg-white">
          <div className="flex justify-between items-center p-2 border-b">
            <span className="font-bold">{folderStructure.name}</span>
            <button className="text-xl" onClick={createFile}>+</button>
          </div>
          <div className="p-2">
            {folderStructure.children.length > 0 ? (
              folderStructure.children.map((child, index) => 
                renderFileTree(child, `${index}`)
              )
            ) : (
              <div className="p-2 text-gray-900 font-light">
                Select a folder to view files
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 bg-white">
            {/* {selectedFile ? 
              <p>Currently selected: {selectedFile}</p> : 
              <p>Select a file to begin editing</p>
            } */}
          <Canvas state={state}/>
        </div>
      </div>
    </div>
  );
};

export default FileExplorerIDE;