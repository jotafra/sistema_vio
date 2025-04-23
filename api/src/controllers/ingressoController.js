const connect = require("../db/connect");
module.exports = class ingressoController {

  static async createIngresso(req, res) {
    const { preco, tipo, fk_id_evento } = req.body;

    if (!preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `INSERT INTO ingresso (preco, tipo, fk_id_evento) VALUES (?, ?, ?)`;
    const values = [preco, tipo, fk_id_evento];

    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o ingresso!" });
        }
        return res.status(201).json({ message: "Ingresso criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao criar Ingresso:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }

  static async getAllIngressos(req, res) {
    const query = `SELECT * FROM ingresso`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar ingressos!" });
        }
        return res.status(200).json({ message: "Ingressos listados com sucesso", ingresso:results });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }

  static async updateIngresso(req, res) {
    const { id_ingresso, preco, tipo, fk_id_evento } = req.body;

    if (!id_ingresso || !preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE ingresso SET preco=?, tipo=?, fk_id_evento=? WHERE id_ingresso = ?`;
    const values = [preco, tipo, fk_id_evento, id_ingresso];

    try {
      connect.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o ingresso!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Ingresso não encontrado" });
        }
        return res.status(200).json({ message: "Ingresso atualizado com sucesso" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteIngresso(req, res) {
    const id_ingresso = req.params.id;

    const query = `DELETE FROM ingresso WHERE id_ingresso = ?`;
    const values = [id_ingresso];

    try {
      connect.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir o ingresso" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Ingresso não encontrado" });
        }
        return res.status(200).json({ message: "Ingresso excluído com sucesso" });
      });
    } catch (error) {
      console.log("Erro ao deletar Ingresso:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getByIdEvento(req, res) {
    const eventoId = req.params.id;
  
    const query = `
      SELECT 
        ingresso.id_ingresso, 
        ingresso.preco, 
        ingresso.tipo, 
        ingresso.fk_id_evento, 
        evento.nome AS nome_evento
      FROM ingresso
      JOIN evento ON ingresso.fk_id_evento = evento.id_evento
      WHERE evento.id_evento = ?;
    `;
  
    try {
      connect.query(query, [eventoId], (err, results) => {
        if (err) {
          console.error("Erro ao buscar ingressos por evento:", err);
          return res.status(500).json({ error: "Erro ao buscar ingressos do evento" });
        }
  
        res.status(200).json({
          message: "Ingressos do evento obtidos com sucesso",
          ingressos: results,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }





};
