import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardCheckbox,
  CardAction,
  CardAsset,
  CardTimer,
  CardContent,
  CardBadge,
  CardTitle,
  CardSubtitle,
} from "@strapi/design-system";

export class CardElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const handleChange = this.props.onDrop;
    return (
      <Card
        style={{
          width: "240px",
        }}
        id="second"
      >
        <CardHeader>
          <CardAsset src={this.props.img} />
        </CardHeader>
        <CardBody>
          <CardContent>
            <CardTitle>{this.props.filename}</CardTitle>
            {/* <CardSubtitle>PNG - 400✕400</CardSubtitle> */}
          </CardContent>
          <CardBadge>Doc</CardBadge>
        </CardBody>
      </Card>
    );
  }
}
