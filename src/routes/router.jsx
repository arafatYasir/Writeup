import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Root from "../layouts/Root";
import BlogDetails from "../components/BlogDetails";
import CreateBlog from "../components/CreateBlog";
import PrivateRoute from "./PrivateRoute";

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
            }
        ]
    }
])
export default router;