export const createStorage = () => {
  let grantedStyles = [
    "color: #fff",
    "background-color: #484",
    "padding: 10px 10px",
    "border-radius: 2px"
  ].join(";");
  const checkmarkEmoji = `\u2714`;

  const megabyteSize = 1024 * 1024;
  const desiredCapacity = 128 * megabyteSize;
  const storage = new window.LargeLocalStorage({ size: desiredCapacity });
  const storageStatus = {
    initialized: false,
    granted: false
  };

  storage.initialized.then((_) => {
    storageStatus.initialized = true;
    const grantedCapacity = storage.getCapacity();
    storageStatus.granted = !(grantedCapacity !== -1 && grantedCapacity !== desiredCapacity);
    console.log(`%c${checkmarkEmoji} Got ${grantedCapacity / megabyteSize}MB for LLS`, grantedStyles);
  });

  return { storage, storageStatus };
};

