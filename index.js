const iotsdk = require("aws-iot-device-sdk-v2");
const mqtt = iotsdk.mqtt;
const { exit } = require("process");
const TextDecoder = require("util").TextDecoder;
const { get_connection } = require("./mqtt/get_connection");

const decoder = new TextDecoder("utf8");

async function on_publish(topic, payload, dup, qos, retain) {
  const json = decoder.decode(payload);
  const message = JSON.parse(json);

  // display message to terminal
  console.log(
    `Publish from topic ${topic} received. Message: ${message.message}`
  );
}

async function main() {
  const connection = get_connection();

  await connection.connect().catch((error) => {
    console.log(`Connect error: ${error}`);
    exit(-1);
  });

  await connection.subscribe("topic_1", mqtt.QoS.AtLeastOnce, on_publish);
  await connection.subscribe("topic_2", mqtt.QoS.AtLeastOnce, on_publish);
}

main();
