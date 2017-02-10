package routes

import (
	"net/http"

	"github.com/generationtux/brizo/app/handlers/web"
	"github.com/generationtux/brizo/auth"
	"github.com/go-zoo/bone"
	"github.com/urfave/negroni"
)

// mainRoutes registers the routes for the user interface
func mainRoutes() *bone.Mux {
	router := bone.New()

	// Home page
	router.GetFunc("/", web.RootHandler)
	router.GetFunc("/favicon-16x16.png", func(rw http.ResponseWriter, r *http.Request) {
		http.ServeFile(rw, r, "ui/favicon-16x16.png")
	})
	router.GetFunc("/favicon-32x32.png", func(rw http.ResponseWriter, r *http.Request) {
		http.ServeFile(rw, r, "ui/favicon-32x32.png")
	})

	// Javascript UI
	router.GetFunc("/app", web.UIHandler)
	router.GetFunc("/app/*", web.UIHandler)
	router.Get("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("ui/dist/"))))

	// Healthz endpoint
	router.GetFunc("/healthz", web.HealthzHandler)

	// OAuth endpoints
	router.GetFunc("/o/auth/login/github", web.AuthGithubHandler)
	router.GetFunc("/o/auth/callback/github", web.AuthGithubCallbackHandler)

	return router
}

// BuildRouter configures the application router
func BuildRouter() http.Handler {
	// other routes
	r := mainRoutes()

	// protected API routes
	authorizedAPI := authAPIRoutes()
	r.SubRoute("/api/v1", negroni.New(
		negroni.HandlerFunc(auth.APIMiddleware),
		negroni.Wrap(authorizedAPI),
	))

	// unprotected API routes
	openAPI := apiRoutes()
	r.SubRoute("/api/v1", openAPI)

	n := negroni.New()
	n.Use(negroni.NewLogger())
	n.Use(negroni.NewRecovery())
	n.UseHandler(r)

	return n
}
