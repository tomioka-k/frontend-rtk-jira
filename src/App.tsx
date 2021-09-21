import {
	Grid,
	Avatar,
	makeStyles,
	createTheme,
	ThemeProvider,
	Theme,
} from "@material-ui/core";
import { ExitToApp, Polymer } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";
import { AppDispatch } from "./app/store";

import {
	selectLoginUser,
	selectProfiles,
	fetchAsyncGetMyProf,
	fetchAsyncGetProfs,
	fetchAsyncUpdateProf,
} from "./features/auth/authSlice";

import TaskDisplay from "./features/task/TaskDisplay";
import TaskForm from "./features/task/TaskForm";
import TaskList from "./features/task/TaskList";

import {
	fetchAsyncGetTasks,
	fetchAsyncGetUsers,
	fetchAsyncGetCategory,
	selectEditedTask,
	selectTasks,
} from "./features/task/taskSlice";

const theme = createTheme({
	palette: {
		secondary: {
			main: "#3cb371",
		},
	},
});

const useStyles = makeStyles((theme: Theme) => ({
	icon: {
		marginTop: theme.spacing(3),
		cursor: "none",
	},
	avatar: {
		marginLeft: theme.spacing(1),
	},
}));

const App: React.FC = () => {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();
	const editedTask = useSelector(selectEditedTask);
	const tasks = useSelector(selectTasks);
	const loginUser = useSelector(selectLoginUser);
	const profiles = useSelector(selectProfiles);

	const loginProfile = profiles.filter(
		(prof) => prof.user_profile === loginUser.id
	)[0];

	const logout = () => {
		localStorage.removeItem("localJWT");
		window.location.href = "/";
	};

	const handlerEditPicture = () => {
		const fileInput = document.getElementById("imageInput");
		fileInput?.click();
	};

	useEffect(() => {
		const fetchBootLoader = async () => {
			await dispatch(fetchAsyncGetTasks());
			await dispatch(fetchAsyncGetMyProf());
			await dispatch(fetchAsyncGetUsers());
			await dispatch(fetchAsyncGetProfs());
			await dispatch(fetchAsyncGetCategory());
		};
		fetchBootLoader();
	}, [dispatch]);

	return (
		<ThemeProvider theme={theme}>
			<div className={styles.app__root}>
				<Grid container>
					<Grid item xs={4}>
						<Polymer className={classes.icon} />
					</Grid>
					<Grid item xs={4}>
						<h1>Scrum Task Board</h1>
					</Grid>
					<Grid item xs={4}>
						<div className={styles.app__iconLogout}>
							<button className={styles.app__iconLogout} onClick={logout}>
								<ExitToApp fontSize="large" />
							</button>
							<input
								type="file"
								id="imageInput"
								hidden={true}
								onChange={(e) => {
									dispatch(
										fetchAsyncUpdateProf({
											id: loginProfile.id,
											img: e.target.files !== null ? e.target.files[0] : null,
										})
									);
								}}
							/>
							<button className={styles.app__btn} onClick={handlerEditPicture}>
								<Avatar
									className={classes.avatar}
									alt="avatar"
									src={
										loginProfile?.img !== null ? loginProfile?.img : undefined
									}
								/>
							</button>
						</div>
					</Grid>
					<Grid item xs={6}>
						{tasks[0]?.task && <TaskList />}
					</Grid>
					<Grid item xs={6}>
						<Grid
							container
							direction="column"
							alignItems="center"
							justify="center"
							style={{ minHeight: "80vh" }}
						>
							<Grid item>
								{editedTask.status ? <TaskForm /> : <TaskDisplay />}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</ThemeProvider>
	);
};

export default App;
