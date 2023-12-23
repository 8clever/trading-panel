import { Modal } from "antd";

interface IProps {
	visible: boolean;
	toggle: () => void;
	value: object;
}

export function ProviderModal (props: IProps) {
	return (
		<Modal open={props.visible} title="Provider" onCancel={props.toggle}>

		</Modal>
	)
}