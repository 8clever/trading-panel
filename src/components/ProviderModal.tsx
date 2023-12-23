import { Form, Input, Modal, Select } from "antd";
import * as ccxt from 'ccxt'
import React from "react";

interface IProps {
	visible: boolean;
	toggle: () => void;
	value: object;
}

export function ProviderModal (props: IProps) {

	const providers = React.useMemo(() => {
		return Object.keys(ccxt.exchanges);
	}, []);

	return (
		<Modal open={props.visible} title="Provider" onCancel={props.toggle}>
			<Form>
				<Form.Item name="provider" label="Provider">
					<Select showSearch placeholder="Not Selected">
						{providers.map(p => {
							return <Select.Option key={p} value={p}>{p}</Select.Option>
						})}
					</Select>
				</Form.Item>
				<Form.Item name={'apiKey'} label="Api Key">
					<Input />
				</Form.Item>
				<Form.Item name={'secret'} label="Secret">
					<Input />
				</Form.Item>
				<Form.Item name={'password'} label="Password">
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
}