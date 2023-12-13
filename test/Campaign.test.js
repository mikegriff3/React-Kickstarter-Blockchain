const { Web3 } = require("web3");
const ganache = require("ganache");
const assert = require("assert");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks the caller as campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute and become approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    // const approverCount = await campaign.methods.approversCount().call();
    // assert(approverCount > 0);
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires minimum contribution", async () => {
    let e;
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "2",
      });
    } catch (err) {
      e = err;
    }
    assert(e);
  });

  it("allows a manager to create a request", async () => {
    await campaign.methods
      .createRequest("test request", "3000", accounts[2])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("test request", request["description"]);
  });
});
