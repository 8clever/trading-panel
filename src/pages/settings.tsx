import { PageLayout } from "@src/components/PageLayout";
import { Link } from "react-router-dom";
import { RollbackOutlined } from '@ant-design/icons'
import { Button } from "antd";

export function Settings () {
	return (
		<PageLayout 
			title="Settings"
			menu={
				<Link to="/">
					<Button icon={<RollbackOutlined />} />
				</Link>
			}>
		</PageLayout>
	)
}