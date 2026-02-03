async function main() {
  const Chat = await ethers.getContractFactory("Chat");
  const chat = await Chat.deploy();

  // Ethers v6 way
  await chat.waitForDeployment();

  const address = await chat.getAddress();
  console.log("Chat contract deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
