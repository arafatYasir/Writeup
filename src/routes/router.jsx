import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../layouts/Root";
import BlogDetails from "../pages/BlogDetails";
import PrivateRoute from "./PrivateRoute";
import CreateBlog from "../pages/CreateBlog";
import UserBlogs from "../pages/UserBlogs";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/blogs/:blogId",
                element: <BlogDetails />
            },
            {
                path: "/create-blog",
                element: <PrivateRoute><CreateBlog /></PrivateRoute>
            },
            {
                path: "/profile",
                element: <PrivateRoute></PrivateRoute>
            },
            {
                path: "/your-blogs",
                element: <PrivateRoute><UserBlogs /></PrivateRoute>
            },
            {
                path: "/bookmarks",
                element: <PrivateRoute></PrivateRoute>
            }
        ]
    }
])
export default router;