import { makeStyles, Theme } from "@material-ui/core";
import {
	AddCircleOutline,
	DeleteOutlineOutlined,
	EditOutlined,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import styles from "./TaskList.module.css";

import {
	Button,
	Avatar,
	Badge,
	Table,
	TableHead,
	TableCell,
	TableRow,
	TableBody,
	TableSortLabel,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
	editTask,
	fetchAsyncDeleteTask,
	selectTask,
	selectTasks,
} from "./taskSlice";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		tableLayout: "fixed",
	},
	button: {
		margin: theme.spacing(3),
	},
	small: {
		margin: "auto",
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
}));

const TaskList: React.FC = () => {
	const classes = useStyles();
	const dispath: AppDispatch = useDispatch();
	const tasks = useSelector(selectTasks);
	const loginUser = useSelector(selectLoginUser);
	const profiles = useSelector(selectProfiles);
	const columns = tasks[0] && Object.keys(tasks[0]);

	const [state, setState] = useState<SORT_STATE>({
		rows: tasks,
		order: "desc",
		activeKey: "",
	});

	const handleClickSortColumn = (column: keyof READ_TASK) => {
		const isDesc = column === state.activeKey && state.order === "desc";
		const newOrder = isDesc ? "asc" : "desc";
		const sortedRows = Array.from(state.rows).sort((a, b) => {
			if (a[column] > b[column]) {
				return newOrder === "asc" ? 1 : -1;
			} else if (a[column] < b[column]) {
				return newOrder === "asc" ? -1 : 1;
			} else {
				return 0;
			}
		});
		setState({
			rows: sortedRows,
			order: newOrder,
			activeKey: column,
		});
	};

	useEffect(() => {
		setState((state) => ({
			...state,
			rows: tasks,
		}));
	}, [tasks]);

	const renderSwitch = (statusName: string) => {
		switch (statusName) {
			case "Not started":
				return (
					<Badge variant="dot" color="error">
						{statusName}
					</Badge>
				);
			case "On going":
				return (
					<Badge variant="dot" color="primary">
						{statusName}
					</Badge>
				);
			case "Done":
				return (
					<Badge variant="dot" color="secondary">
						{statusName}
					</Badge>
				);
			default:
				return null;
		}
	};

	const coniditionalSrc = (user: number) => {
		const loginProfile = profiles.filter(
			(prof) => prof.user_profile === user
		)[0];
		return loginProfile?.img !== null ? loginProfile?.img : undefined;
	};

	return (
		<>
			<Button
				className={classes.button}
				variant="contained"
				color="primary"
				size="small"
				startIcon={<AddCircleOutline />}
				onClick={() => {
					dispath(
						editTask({
							id: 0,
							task: "",
							description: "",
							criteria: "",
							responsible: loginUser.id,
							status: "1",
							category: 1,
							estimate: 0,
						})
					);
					dispath(selectTask(initialState.selectedTask));
				}}
			>
				Add new
			</Button>
			{tasks[0]?.task && (
				<Table size="small" className={classes.table}>
					<TableHead>
						<TableRow>
							{columns.map(
								(column, colIndex) =>
									(column === "task" ||
										column === "status" ||
										column === "category" ||
										column === "estimate" ||
										column === "responsible" ||
										column === "owner") && (
										<TableCell align="center" key={colIndex}>
											<TableSortLabel
												active={state.activeKey === column}
												direction={state.order}
												onClick={() => handleClickSortColumn(column)}
											>
												<strong>{column}</strong>
											</TableSortLabel>
										</TableCell>
									)
							)}
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{state.rows.map((row, rowIndex) => (
							<TableRow hover key={rowIndex}>
								{Object.keys(row).map(
									(key, colIndex) =>
										(key === "task" ||
											key === "status_name" ||
											key === "category_item" ||
											key === "estimate") && (
											<TableCell
												align="center"
												className={styles.tasklist_hover}
												key={`${rowIndex}+${colIndex}`}
												onClick={() => {
													dispath(selectTask(row));
													dispath(editTask(initialState.editedTask));
												}}
											>
												{key === "status_name" ? (
													renderSwitch(row[key])
												) : (
													<span>{row[key]}</span>
												)}
											</TableCell>
										)
								)}
								<TableCell>
									<Avatar
										className={classes.small}
										alt="resp"
										src={coniditionalSrc(row["responsible"])}
									/>
								</TableCell>
								<TableCell>
									<Avatar
										className={classes.small}
										alt="owner"
										src={coniditionalSrc(row["owner"])}
									/>
								</TableCell>
								<TableCell align="center">
									<button
										className={styles.tasklist__icon}
										onClick={() => {
											dispath(fetchAsyncDeleteTask(row.id));
										}}
										disabled={row["owner"] !== loginUser.id}
									>
										<DeleteOutlineOutlined />
									</button>
									<button
										className={styles.tasklist__icon}
										onClick={() => dispath(editTask(row))}
										disabled={row["owner"] !== loginUser.id}
									>
										<EditOutlined />
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};

export default TaskList;
