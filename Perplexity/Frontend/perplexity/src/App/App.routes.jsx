import {
    createBrowserRouter,
    Navigate,
    Outlet,
    useLocation,
} from "react-router";
import Login from "../Features/Auth/pages/Login";
import Registration from "../Features/Auth/pages/Registration";
import Dashboard from "../Features/Dashboard/pages/Dashboard";
import { useAuth } from "../Features/Auth/hooks/useAuth";

const SessionLoader = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm font-semibold shadow-2xl shadow-black/50">
                Loading Perplexity...
            </div>
        </main>
    );
};

const RequireAuth = () => {
    const { isAuthenticated, sessionChecked } = useAuth();
    const location = useLocation();

    if (!sessionChecked) {
        return <SessionLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

const PublicOnly = () => {
    const { isAuthenticated, sessionChecked } = useAuth();

    if (!sessionChecked) {
        return <SessionLoader />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Navigate to="/dashboard" replace />
        },
        {
            element: <PublicOnly />,
            children: [
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    path: "/register",
                    element: <Registration />
                },
            ],
        },
        {
            element: <RequireAuth />,
            children: [
                {
                    path: "/dashboard",
                    element: <Dashboard />
                },
                {
                    path: "/home",
                    element: <Navigate to="/dashboard" replace />
                },
            ],
        },
        {
            path: "*",
            element: <Navigate to="/dashboard" replace />
        }
    ]
)
