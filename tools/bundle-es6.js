import fs from "fs";
import path from "path";
import chalk from "chalk";
import crypto from "crypto";
import rimraf from "rimraf";
import child_process from "child_process";
import pack from "../node_modules/react-native/package.json";

const SSH_HOST = "ubuntu@52.76.29.201"; // The server user and host
const BUNDLE_NAME = "index.android.bundle"; // Name of the bundle
const GRADLE_PATH = __dirname + "/../android/app/build.gradle"; // Path to the gradle configuration

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

log.i("Generating JavaScript bundle", BUNDLE_NAME);

const bundlePath = bundlesDir + "/" + BUNDLE_NAME;
const assetsPath = bundlesDir + "/assets";
const metadataFile = bundlesDir + "/metadata.json";

const bundle = child_process.spawn("react-native", [
	"bundle", "--platform", "android", "--dev", "false",
	"--entry-file", __dirname + "/../index.android.js",
	"--assets-dest", assetsPath,
	"--bundle-output", bundlePath
]);

function listFiles(parent, _dir, _files) {
	_files = _files || [];
	_dir = _dir || parent;

	const files = fs.readdirSync(_dir);

	for (const f in files) {
		if (/^\./.test(files[f])) {
			continue;
		}

		const name = _dir + "/" + files[f];

		if (fs.statSync(name).isDirectory()) {
			listFiles(parent, name, _files);
		} else {
			_files.push(path.relative(parent, name));
		}
	}

	return _files;

}

bundle.stdout.on("data", d => log.i(d));
bundle.stderr.on("data", d => log.e(d));
bundle.on("exit", code => {
	if (code !== 0) {
		log.e("Failed to generate bundle", code);

		process.exit(code);
	}

	// Read the bundle so that we can generate checksum
	log.i(chalk.gray("Generating checksums for bundle"), chalk.bold(bundlePath));

	const data = fs.readFileSync(bundlePath).toString();

	// Checksums can be used to verify bundle integrity
	metadata.checksum_md5 = crypto.createHash("md5").update(data, "utf8").digest("hex");
	metadata.checksum_sha256 = crypto.createHash("sha256").update(data, "utf8").digest("hex");

	// List all assets
	metadata.assets = listFiles(assetsPath);

	// Cleanup assets directory
	rimraf.sync(assetsPath);

	log.i("Writing metadata", metadataFile);

	fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2) + "\n", "utf-8");

	log.i("Uploading files to server", SSH_HOST);

	const upload = child_process.spawn("scp", [ "-r", bundlesDir, `${SSH_HOST}:/home/ubuntu/scrollback/public/s/bundles/android/` ]);

	upload.stdout.on("data", d => log.i(d));
	upload.stderr.on("data", d => log.e(d));
	upload.on("exit", c => {
		if (c !== 0) {
			log.e("Failed to upload files", c);

			process.exit(c);
		}

		log.i("Upload complete!");
	});
});
