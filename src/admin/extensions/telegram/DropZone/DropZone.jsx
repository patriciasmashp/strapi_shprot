import React from "react";
import { FileUploader } from "react-drag-drop-files";

export class DropZone extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   files: [],
    // };
  }
//   handleChange = (file) =>{
//     this.setState({files: file});
//   }
  render() {
    const handleChange = this.props.onDrop
    return (<FileUploader handleChange={handleChange} name="file" multiple={true} classes={["drop-zone"]} />);
  }
}
