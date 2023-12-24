import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "@renderer/pages/home";
import { Settings } from "@renderer/pages/settings";

export function Router () {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</HashRouter>
	)
}