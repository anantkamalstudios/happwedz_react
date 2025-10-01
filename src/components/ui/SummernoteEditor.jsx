import React from "react";
import "summernote/dist/summernote-lite.css";
import $ from "jquery";
import "summernote/dist/summernote-lite.js";

const SummernoteEditor = ({ value, onChange }) => {
  const editorRef = React.useRef();

  React.useEffect(() => {
    $(editorRef.current).summernote({
      height: 200,
      tabsize: 2,
      callbacks: {
        onChange: (contents) => {
          onChange(contents);
        },
      },
    });
    // Set initial value
    $(editorRef.current).summernote("code", value || "");
    return () => {
      $(editorRef.current).summernote("destroy");
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if ($(editorRef.current).summernote("code") !== value) {
      $(editorRef.current).summernote("code", value || "");
    }
  }, [value]);

  return <textarea ref={editorRef} />;
};

export default SummernoteEditor;
