import { Form, Input, Modal, Select } from "antd";
import * as ccxt from 'ccxt'
import React from "react";
import { Provider } from "./entities";
import { storage } from "./Storage";

interface IProps {
	visible: boolean;
	toggle: () => void;
	onSave: () => void;
	value?: string | null;
}

export function ProviderModal (props: IProps) {
	const { onSave, toggle, value, visible } = props;

	const providers = React.useMemo(() => {
		return Object.keys(ccxt.exchanges);
	}, []);

	const finish = React.useCallback((value: Provider) => {
		storage.providers.save(value);
		onSave();
		toggle()
	}, [ onSave, toggle ]);

	const [form] = Form.useForm();

	React.useEffect(() => {
		if (!visible) return;
		
		form.resetFields();
		if (!value) return;

		(async () => {
			const item = await storage.providers.findById(value);
			if (!item) return;
				
			form.setFieldsValue(item);
		})();
	}, [ value, visible, form.resetFields ]);

	return (
		<Modal open={props.visible} title="Provider" onCancel={props.toggle} onOk={form.submit}>
			<Form onFinish={finish} form={form}>
				<Form.Item name="id" noStyle/>
				<Form.Item name="name" label="Name">
					<Input />
				</Form.Item>
				<Form.Item name="provider" label="Provider">
					<Select showSearch>
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