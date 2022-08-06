import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
let owner, Alice, Bob, Joe;

describe("Apartment", function () {


  it("Contract creator should have 100 shares of apartament",async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Alice, Bob, Joe] = await ethers.getSigners();

    await apartment.deployed();
    let ownerBalance = await apartment.balanceOf(owner.address);

    expect(ownerBalance).to.equal(100);

  })

  it("It should be possible to transfer some shares to another user", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Alice] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Alice.address, 20);
    expect(await apartment.balanceOf(Alice.address)).to.equal(20);
    expect(await apartment.balanceOf(owner.address)).to.equal(80);
  })


it("It should be possible to pay the rent and deposit it in ether in the apartment contract", async () => {
  const Apartment = await ethers.getContractFactory("Apartment");
  const apartment = await Apartment.deploy();

  [owner, Alice, Bob] = await ethers.getSigners();

  await apartment.deployed();

  await Bob.sendTransaction({
    to: apartment.address,
    value: ethers.utils.parseEther("1")
  })

  expect(await apartment.balance()).to.equal(ethers.utils.parseEther("1"));
})

it("Owner should be able to withdraw resources paid as rent", async () => {
  const Apartment = await ethers.getContractFactory("Apartment");
  const apartment = await Apartment.deploy();

  [owner, Alice, Bob] = await ethers.getSigners();

  await apartment.deployed();
  await apartment.transfer(Alice.address, 20);

  await Bob.sendTransaction({
    to: apartment.address,
    value: ethers.utils.parseEther("1")
  });

  const ownerBalanceBeforeWithdrawal = await owner.getBalance();
  await apartment.withdraw();

  expect(await (await owner.getBalance()).gt(ownerBalanceBeforeWithdrawal)).to.be.true;
});

it("Shareholder be able to withdraw resources paid as rent", async () => {
  const Apartment = await ethers.getContractFactory("Apartment");
  const apartment = await Apartment.deploy();

  [owner, Alice, Bob] = await ethers.getSigners();

  await apartment.deployed();
  await apartment.transfer(Alice.address, 20);

  await Bob.sendTransaction({
    to: apartment.address,
    value: ethers.utils.parseEther("1")
  });

  const aliceBalanceBeforeWithdrawal = await Alice.getBalance();
  await apartment.connect(Alice).withdraw();
  expect(await (await Alice.getBalance()).gt(aliceBalanceBeforeWithdrawal)).to.be.true;

})

it("Attempt to withdraw by non shareholder should be reverted", async () => {
  const Apartment = await ethers.getContractFactory("Apartment");
  const apartment = await Apartment.deploy();

  [owner, Alice, Bob] = await ethers.getSigners();

  await apartment.deployed();
  await apartment.transfer(Alice.address, 20);

  await Bob.sendTransaction({
    to: apartment.address,
    value: ethers.utils.parseEther("1")
  });

  await expect(apartment.connect(Bob).withdraw()).to.be.revertedWith("unauthorized");
})


it("Apartment shareholder be able to withdraw resources proportional to his share", async () => {
  const Apartment = await ethers.getContractFactory("Apartment");
  const apartment = await Apartment.deploy();

  [owner, Alice, Bob] = await ethers.getSigners();

  await apartment.deployed();
  await apartment.transfer(Alice.address, 20);

  await Bob.sendTransaction({
    to: apartment.address,
    value: ethers.utils.parseEther("1")
  });

  const aliceBalanceBeforeWithdrawal = await Alice.getBalance();

  await apartment.connect(Alice).withdraw();
  expect(await (await apartment.balance()).eq(ethers.utils.parseEther("0.8"))).to.be.true;
  expect(await (await apartment.balance()).gt(ethers.utils.parseEther("0"))).to.be.true;
  expect(await (await Alice.getBalance()).gt(aliceBalanceBeforeWithdrawal)).to.be.true;




})

it("It should not be possible to withdraw more than one should", async () => {
  const Apartment = await ethers.getContractFactory("Apartment");
  const apartment = await Apartment.deploy();

  [owner, Alice, Bob] = await ethers.getSigners();

  await apartment.deployed();
  await apartment.transfer(Alice.address, 20);

  await Bob.sendTransaction({
    to: apartment.address,
    value: ethers.utils.parseEther("1")
  });

  await apartment.connect(Alice).withdraw();
  await expect(apartment.connect(Alice).withdraw()).to.be.revertedWith("0 funds to withdraw");
})
}

// import { ethers } from "hardhat";

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = ethers.utils.parseEther("1");

//   const Lock = await ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log("Lock with 1 ETH deployed to:", lock.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
