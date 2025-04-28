import React from "react";
import { Wrapper } from "./styles";
import Editor from "react-simple-wysiwyg";
import { Flex, Button, Box, Alert } from "@strapi/design-system";
import { DropZone } from "./DropZone/DropZone";
import { CardElement } from "./CardElement";
import axios from "axios";

export class TelegramMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: "",
      files: null,
      alertVisible: false,
    };
  }

  onChange = (e) => {
    this.setState({ html: e.target.value });
  };
  onDrop = (files) => {
    this.setState({ files: files });
  };
  renderImages() {
    if (this.state.files) {
      let files = [];
      Array.from(this.state.files).forEach((file, idx) => {
        files.push(
          <CardElement
            key={idx}
            img={URL.createObjectURL(file)}
            filename={file.name}
          ></CardElement>
        );
      });

      return (
        <div className="strapi-block" style={{ marginLeft: "15px" }}>
          <Flex
            style={{ flexWrap: "wrap" }}
            gap={{
              initial: 1,
              medium: 4,
              large: 8,
            }}
            direction={{
              initial: "column",
              medium: "row",
            }}
            alignItems={{
              initial: "center",
              medium: "flex-start",
            }}
          >
            {files}
          </Flex>
        </div>
      );
    }
  }

  async sendMessage() {
    // const html =
    let formData = new FormData();

    formData.append("html", this.state.html);
    if (this.state.files) {
      Array.from(this.state.files).forEach((item, i) => {
        formData.append(i, item);
      });
    }

    const result = await axios.post("/api/telegram/allert", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    
    console.log(result);
    
    if (result.status == 200) {
      this.setState({
        alertVisible: (
          <Alert closeLabel="Close alert" variant="success" title="Отправка сообщения">
            Сообщение разослано
          </Alert>
        ),
      });
    }
    else{
      this.setState({
          
        alertVisible: (
          <Alert closeLabel="Close alert" variant="danger" title="Отправка сообщения">
            {result.data}
          </Alert>
        ),
      });
    }
    setTimeout(() => {
      this.setState({
        alertVisible: null,
      });
    }, 5000);
  }
  render() {
    return (
      <Wrapper>
      <div style={{ margin: "5%", display: "flex" }}>
        <div className="strapi-block">
          <div style={{ margin: "auto" }}>
            <DropZone files={this.state.files} onDrop={this.onDrop} />
          </div>
          <Editor
            value={this.state.html}
            containerProps={{ style: { resize: "vertical" } }}
            onChange={this.onChange}
          />
          <div style={{ textAlign: "center", margin: "10px" }}>
            <Button
              size={"L"}
              variant={"success"}
              onClick={this.sendMessage.bind(this)}
            >
              Отправить
            </Button>
          </div>
        </div>
        {this.renderImages()}
        {this.state.alertVisible && (
          <Box
            className="strapi-alert"
            style={{
              width: 700,
            }}
          >
            {this.state.alertVisible}
          </Box>
        )}
      </div>
      </Wrapper>
    );
  }
}
