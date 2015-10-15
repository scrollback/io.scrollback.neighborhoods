import { NativeModules } from "react-native";

const { FileUploadModule } = NativeModules;

let fileUploadId = 0;

export default {
	uploadFile(baseUrl: string, fileUri: string, fileName: string, formData: Object, cb: Function) {
		fileUploadId++;

		FileUploadModule.uploadFile(fileUploadId, baseUrl, fileUri, fileName, formData, cb);

		return fileUploadId;
	},

	cancelUpload(id: Number) {
		FileUploadModule.cancelUpload(id);
	}
};
