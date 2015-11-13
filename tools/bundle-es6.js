import fs from "fs";
import path from "path";
import chalk from "chalk";
import crypto from "crypto";
import child_process from "child_process";
import pack from "../node_modules/react-native/package.json";

const SSH_HOST = "ubuntu@52.76.29.201"; // The server user and host
const BUNDLE_NAME = "index.android.bundle"; // Name of the bundle
const BASE_PATH = path.normalize(__dirname + "/../android/app"); // Base path of the Android app
const GRADLE_PATH = BASE_PATH + "/build.gradle"; // Path to the gradle configuration
const BUNDLE_PATH = BASE_PATH + "/src/main/assets/" + BUNDLE_NAME; // Path to the bundle assets directory

const log = {
	i(description, details) {
		console.log(chalk.gray(description), typeof details !== "undefined" ? chalk.bold(details) : "");
	},

	e(description, details) {
		console.log(chalk.red(description), typeof details !== "undefined" ? chalk.bold(details) : "");
	}
};

const metadata = {
	filename: BUNDLE_NAME
};

// Read the gradle configuration
log.i("Reading gradle configuration", GRADLE_PATH);

const lines = fs.readFileSync(GRADLE_PATH).toString().split("\n");

// Extract the version number and version code
for (const line of lines) {
	if (/versionName/.test(line)) {
		// Version name should be changed whenever any native APIs change
		metadata.version_name = line.trim().split(" ")[1].replace(/("|')/g, "");

		log.i("Found version name", metadata.version_name);
	} else if (/versionCode/.test(line)) {
		metadata.version_code = parseInt(line.trim().split(" ")[1], 10);

		log.i("Found version code", metadata.version_code);
	}

	if (metadata.version_name && metadata.version_code) {
		break;
	}
}

// Read the bundle so that we can generate checksum
log.i(chalk.gray("Generating checksums for bundle"), chalk.bold(BUNDLE_PATH));

const data = fs.readFileSync(BUNDLE_PATH).toString();

// Checksums can be used to verify bundle integrity
metadata.checksum_md5 = crypto.createHash("md5").update(data, "utf8").digest("hex");
metadata.checksum_sha256 = crypto.createHash("sha256").update(data, "utf8").digest("hex");

metadata.react_native_version = pack.version; // React native version may be useful in determining compatibility

log.i("Found React Native version", metadata.react_native_version);

// Timestamp can be used to determine if bundle is newer
metadata.timestamp = Date.now();

// Create the bundles directory and copy the bundle
const bundlesDir = path.normalize(__dirname + "/../../hey-neighbor-bundles/android/" + metadata.version_name); // Path to output directory, synced to the server

log.i("Creating new directory", bundlesDir);

try {
	fs.mkdirSync(path.dirname(bundlesDir));
} catch (e) {
	// Do nothing
}

try {
	fs.mkdirSync(bundlesDir);
} catch (e) {
	if (e.code !== "EEXIST") {
		throw e;
	}
}

const metadataFile = bundlesDir + "/metadata.json";

log.i("Writing metadata", metadataFile);

fs.writeFileSync(metadataFile, JSON.stringify(metadata) + "\n", "utf-8");

log.i("Copying bundle asset", BUNDLE_NAME);

fs.createReadStream(BUNDLE_PATH).pipe(fs.createWriteStream(bundlesDir + "/" + BUNDLE_NAME));

log.i("Uploading file to server", SSH_HOST);

const upload = child_process.spawn("scp", [ "-r", bundlesDir, `${SSH_HOST}:/home/ubuntu/scrollback/public/s/bundles/android/` ]);

upload.stdout.on("data", d => log.i(d));
upload.stderr.on("data", d => log.e(d));
upload.stdout.on("end", () => log.i("Upload complete!"));
upload.on("exit", code => {
	if (code !== 0) {
		log.e("Failed to upload files", code);

		process.exit(code);
	}
});
