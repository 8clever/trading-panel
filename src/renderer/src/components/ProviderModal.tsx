import { Button, Form, Input, Modal, Select, Typography, notification } from "antd";
import React from "react";
import { Provider } from "./entities";
import { storage } from "./Storage";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface IProps {
	visible: boolean;
	toggle: () => void;
	onSave: () => void;
	value?: string | null;
}

type Valid = 'valid' | "not-valid" | "not-checked" | 'loading'

export function ProviderModal (props: IProps) {
	const { onSave, toggle, value, visible } = props;

	const [ status, setStatus ] = React.useState<Valid>('not-checked')

	const finish = React.useCallback((value: Provider) => {
		storage.providers.save(value);
		onSave();
		toggle()
	}, [ onSave, toggle ]);

	const [form] = Form.useForm();

	React.useEffect(() => {
		if (!visible) return;
		
		setStatus('not-checked');
		form.resetFields();
		if (!value) return;

		(async () => {
			const item = await storage.providers.findById(value);
			if (!item) return;
				
			form.setFieldsValue(item);
		})();
	}, [ value, visible, form.resetFields ]);

	// TODO Complete work with Desktop application
	const validate = React.useCallback(async () => {
		const provider: Provider = await form.validateFields();
		setStatus('loading');
		try {
			await window.exchangeApi(provider, 'fetchBalance');
			setStatus('valid');
		} catch (e) {
			console.error(e)
			notification.error({
				message: (e as Error).message
			});
			setStatus('not-valid')
		}
	}, [ form.getFieldsValue ]);

	return (
		<Modal open={props.visible} title="Provider" onCancel={props.toggle} onOk={form.submit}>
			<Form onFinish={finish} form={form}>
				<Form.Item name="id" noStyle/>
				<Form.Item name="name" label="Name">
					<Input />
				</Form.Item>
				<Form.Item name="provider" label="Provider">
					<Select showSearch>
						{window.exchanges.map(p => {
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
				<Button 
					loading={status === "loading"}
					icon={
						status === "valid" ? <Typography.Text type="success"><CheckOutlined /></Typography.Text> :
						status === "not-valid" ? <Typography.Text type="danger"><CloseOutlined /></Typography.Text> :
						null
					}
					onClick={validate}>
					Validate
				</Button>
			</Form>
		</Modal>
	)
}