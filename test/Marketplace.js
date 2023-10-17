const Marketplace = artifacts.require("Marketplace");
const MarketplaceTestNft = artifacts.require("MarketplaceTestNft");
const MarketplaceToken = artifacts.require("MarketplaceToken");

contract("Marketplace", (accounts) => {
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  let marketplace;
  let marketplaceTestNft;
  let marketplaceToken;

  beforeEach(async () => {
    marketplaceTestNft = await MarketplaceTestNft.new();
    marketplaceToken = await MarketplaceToken.new();
    marketplace = await Marketplace.new(marketplaceToken.address);

    await marketplaceToken.transfer(accounts[0], 10000);
    await marketplaceToken.transfer(accounts[1], 5000);
    await marketplaceToken.transfer(marketplaceToken.address, 100, { from: accounts[0] });
  });

  it("Should self mint a new NFT", async () => {
    await marketplaceTestNft.mint(accounts[0], 1);
    const owner = await marketplaceTestNft.ownerOf(1);
    assert.equal(owner, accounts[0]);
  });

  it("Should have ERC20 balance gt than 0", async () => {
    const balance = await marketplaceToken.balanceOf(accounts[0]);
    assert.equal(balance > 0, true);
  });

  it("Should List Item in the Marketplace", async () => {
    await marketplaceTestNft.mint(accounts[0], 1);
    await marketplaceTestNft.approve(marketplace.address, 1, { from: accounts[0] });
    await marketplace.listItem(marketplaceTestNft.address, 1, 100, { from: accounts[0] });
    const item = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(item[1], accounts[0]);
  });

  it("Should not return a listing for an unlisted element", async () => {
    const item = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(item[0], 0);
    assert.equal(item[1], zeroAddress);
  });

  it("Should List and Cancel a listing. Then the getListing should return an empty listing", async () => {
    await marketplaceTestNft.mint(accounts[0], 1);
    await marketplaceTestNft.approve(marketplace.address, 1, { from: accounts[0] });
    await marketplace.listItem(marketplaceTestNft.address, 1, 100, { from: accounts[0] });
    const itemListed = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(itemListed[0], 100);
    assert.equal(itemListed[1], accounts[0]);
    await marketplace.cancelListing(marketplaceTestNft.address, 1, { from: accounts[0] });
    const itemUnlisted = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(itemUnlisted[0], 0);
    assert.equal(itemUnlisted[1], zeroAddress);
  });

  it("Should List and then update a listing", async () => {
    await marketplaceTestNft.mint(accounts[0], 1);
    await marketplaceTestNft.approve(marketplace.address, 1, { from: accounts[0] });
    await marketplace.listItem(marketplaceTestNft.address, 1, 100, { from: accounts[0] });
    const itemListed = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(itemListed[0], 100);
    assert.equal(itemListed[1], accounts[0]);
    await marketplace.updateListing(marketplaceTestNft.address, 1, 200, { from: accounts[0] });
    const itemUpdated = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(itemUpdated[0], 200);
    assert.equal(itemUpdated[1], accounts[0]);
  });

  it("Should List from one account and buy from another", async () => {
    await marketplaceTestNft.mint(accounts[0], 1);
    await marketplaceTestNft.approve(marketplace.address, 1, { from: accounts[0] });
    await marketplace.listItem(marketplaceTestNft.address, 1, 100, { from: accounts[0] });
    await marketplaceToken.approve(marketplace.address, 100, { from: accounts[1] });
    await marketplace.buyItem(marketplaceTestNft.address, 1, { from: accounts[1] });
    const item = await marketplace.getListing(marketplaceTestNft.address, 1);
    assert.equal(item[0], 0);
    assert.equal(item[1], zeroAddress);
    const owner = await marketplaceTestNft.ownerOf(1);
    assert.equal(owner, accounts[1]);
    const proceeds = await marketplace.getProceeds(accounts[0]);
    assert.equal(proceeds, 100);
    const account1Balance = await marketplaceToken.balanceOf(accounts[1]);
    assert.equal(account1Balance, 4900);
  });
})