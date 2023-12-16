import React, { Component } from "react";
import Layout from "../../../../components/Layout";
import { Form, Input, Message, Button, Grid } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

class CreateRequest extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.value, "ether"),
          this.state.recipient
        )
        .send({
          from: accounts[0],
        });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create A Request</h3>
        <Grid>
          <Grid.Column width={6}>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Description</label>
                <Input
                  value={this.state.description}
                  onChange={(event) =>
                    this.setState({ description: event.target.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Amount in Ether</label>
                <Input
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Recipient</label>
                <Input
                  value={this.state.recipient}
                  onChange={(event) =>
                    this.setState({ recipient: event.target.value })
                  }
                />
              </Form.Field>
              <Button loading={this.state.loading} primary>
                Create Request
              </Button>
              <Message error header="Oops!" content={this.state.errorMessage} />
            </Form>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default CreateRequest;
