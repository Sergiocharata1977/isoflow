import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { ProcesoModel } from "@/models/proceso-model";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica"
  },
  header: {
    marginBottom: 20,
    textAlign: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 12,
    color: "gray"
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: "row"
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold"
  },
  bodyText: {
    fontSize: 10
  }
});

const ProcesosPDFDocument = ({ procesos }: { procesos: ProcesoModel[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Listado de Procesos</Text>
        <Text style={styles.subtitle}>Generado el {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.table}>
        {/* Encabezados de la tabla */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Título</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Código</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Versión</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Estado</Text>
          </View>
        </View>
        
        {/* Filas de datos */}
        {procesos.map((proceso, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{proceso.titulo}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{proceso.codigo}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>v{proceso.version}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{proceso.estado}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ProcesosPDFDocument;