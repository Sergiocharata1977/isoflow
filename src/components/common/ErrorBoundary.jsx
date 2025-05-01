import React from "react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en componente:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  componentDidMount() {
    if (this.state.hasError) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-background border border-border rounded-lg">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Algo salió mal
          </h2>
          <p className="text-muted-foreground text-center mb-4">
            {this.state.error?.message || "Ha ocurrido un error inesperado"}
          </p>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                this.setState({
                  hasError: false,
                  error: null,
                  errorInfo: null,
                });
                window.location.reload();
              }}
            >
              Recargar página
            </Button>
            {this.props.onReset && (
              <Button
                variant="default"
                onClick={() => {
                  this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                  });
                  this.props.onReset();
                }}
              >
                Reintentar
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
