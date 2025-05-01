import turso from "./db.js";

class MonitoringService {
  constructor() {
    this.lastError = null;
    this.errorCount = 0;
    this.maxErrors = 3;
    this.checkInterval = 30000; // 30 segundos
    this.connectionStatus = "unknown";
    this.metrics = {
      totalQueries: 0,
      failedQueries: 0,
      lastResponse: null,
      avgResponseTime: 0,
    };
    this.startMonitoring();
  }

  async checkDatabaseConnection() {
    const startTime = Date.now();
    try {
      await turso.execute("SELECT 1");
      const responseTime = Date.now() - startTime;

      this.updateMetrics(true, responseTime);
      this.resetErrorCount();
      this.connectionStatus = "healthy";

      return {
        status: "healthy",
        metrics: this.metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      this.handleError(error);
      this.connectionStatus = "unhealthy";

      return {
        status: "unhealthy",
        error: error.message,
        metrics: this.metrics,
        timestamp: new Date().toISOString(),
      };
    }
  }

  updateMetrics(success, responseTime) {
    this.metrics.totalQueries++;
    if (!success) this.metrics.failedQueries++;
    this.metrics.lastResponse = responseTime;

    // Actualizar promedio de tiempo de respuesta
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (this.metrics.totalQueries - 1) +
        responseTime) /
      this.metrics.totalQueries;
  }

  handleError(error) {
    this.errorCount++;
    this.lastError = {
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    };

    if (this.errorCount >= this.maxErrors) {
      this.sendAlert();
    }
  }

  resetErrorCount() {
    if (this.errorCount > 0) {
      console.log("Conexión restaurada después de", this.errorCount, "errores");
    }
    this.errorCount = 0;
    this.lastError = null;
  }

  sendAlert() {
    const alert = {
      type: "database_connection_error",
      message: "Problemas persistentes con la conexión a la base de datos",
      error: this.lastError,
      metrics: this.metrics,
      timestamp: new Date().toISOString(),
      errorCount: this.errorCount,
    };

    console.error("🚨 ALERTA:", alert);
  }

  startMonitoring() {
    console.log("Iniciando monitoreo de base de datos...");
    this.checkDatabaseConnection(); // Verificación inicial

    setInterval(async () => {
      await this.checkDatabaseConnection();
    }, this.checkInterval);
  }

  getStatus() {
    return {
      connectionStatus: this.connectionStatus,
      metrics: this.metrics,
      lastError: this.lastError,
      errorCount: this.errorCount,
    };
  }
}

// Exportar una única instancia del servicio
export default new MonitoringService();
