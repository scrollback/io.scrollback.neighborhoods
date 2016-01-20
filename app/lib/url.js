import config from "../store/config";

const {
	protocol,
	host
} = config.server;

function get(type, entity) {

	switch (type) {
	case "room":
		return `${protocol}//${host}/${entity.id}`;
	case "thread":
		const {
			id,
			to,
			title
		} = entity;

		return `${protocol}//${host}/${to}/${id}/${title.toLowerCase().trim().replace(/['"]/g, "").replace(/\W+/g, "-")}`;
	}
}

export default {
	get
};
