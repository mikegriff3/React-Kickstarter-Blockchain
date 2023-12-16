import React, { Component } from "react";
import Layout from "../../../../components/Layout";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import Link from "next/link";
import { Button, Grid, Table } from "semantic-ui-react";
import RequestRow from "../../../../components/RequestRow";

class Requests extends Component {
  static async getInitialProps(props) {
    const { address } = await props.query;
    const campaign = Campaign(props.query.address);
    const approvers = await campaign.methods.approversCount().call();
    const numRequests = await campaign.methods.getRequestsCount().call();
    const requests = await Promise.all(
      Array(parseInt(numRequests))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    return { address, requests, numRequests, approvers };
  }

  renderRows = () => {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          id={index}
          address={this.props.address}
          approvers={this.props.approvers}
        />
      );
    });
  };

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <h3>Pending Requests</h3>
            </Grid.Column>
            <Grid.Column width={4}>
              <Link href={`/campaigns/${this.props.address}/requests/new`}>
                <a>
                  <Button primary>Create A Request</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                    <Table.HeaderCell>Approval Count</Table.HeaderCell>
                    <Table.HeaderCell>Approve</Table.HeaderCell>
                    <Table.HeaderCell>Finalize</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{this.renderRows()}</Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default Requests;
