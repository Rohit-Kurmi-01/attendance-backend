const c = require("config");
var db = require("./../helpers/db_helpers");
var helper = require("./../helpers/helpers");

const msg_success = "successfully";
const msg_fail = "fail";

module.exports.controller = (app, io, socket_list) => {
  const msg_invalidUser = "invalid username and password";
  const msg_category_added = "Category added Successfully.";
  const msg_category_update = "Category updated Successfully.";
  const msg_category_delete = "Category deleted Successfully.";
  const msg_already_register = "This email already register ";
  const msg_product_added = "Docter added Successfully.";
  const msg_product_update = "Product updated Successfully.";
  const msg_product_delete = "Product deleted Successfully.";

  // Generic access token check for users table
  function checkAccessToken(headerObj, res, callback, require_type = "") {
    helper.Dlog(headerObj.access_token);
    helper.CheckParameterValid(res, headerObj, ["access_token"], () => {
      db.query(
        "SELECT `user_id`, `email`, `role`, `auth_token`, `is_active` FROM `users` WHERE `auth_token` = ? AND `is_active` = 1",
        [headerObj.access_token],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          helper.Dlog(result);
          if (result.length > 0) {
            if (require_type != "") {
              if (require_type == result[0].role) {
                return callback(result[0]);
              } else {
                res.json({
                  status: "0",
                  code: "404",
                  message: "Access denied. Unauthorized user access.",
                });
              }
            } else {
              return callback(result[0]);
            }
          } else {
            res.json({
              status: "0",
              code: "404",
              message: "Access denied. Unauthorized user access.",
            });
          }
        }
      );
    });
  }

  app.post("/api/user/login", (req, res) => {
    helper.Dlog(req.body);
    const reqObj = req.body;

    // Debug: Log incoming credentials
    console.log("LOGIN ATTEMPT:", reqObj.email, reqObj.password);

    helper.CheckParameterValid(
      res,
      reqObj,
      ["email", "password"],
      () => {
        const authToken = helper.createRequestToken();

        db.query(
          "UPDATE `users` SET `auth_token` = ?, `created_at` = NOW() WHERE `email` = ? AND `password_hash` = ? AND `is_active` = 1",
          [
            authToken,
            reqObj.email,
            reqObj.password,
          ],
          (err, result) => {
            if (err) {
              res.status(500).json({ status: "0", message: "Server error", error: err.message });
              return;
            }

            // Debug: Log update result
            console.log("UPDATE RESULT:", result);

            if (result.affectedRows > 0) {
              db.query(
                "SELECT `user_id`, `name`, `email`, `role`, `is_active`, `created_at`, `auth_token` FROM `users` WHERE `email` = ? AND `password_hash` = ? AND `is_active` = 1",
                [reqObj.email, reqObj.password],
                (err, result) => {
                  if (err) {
                    res.status(500).json({ status: "0", message: "Server error", error: err.message });
                    return;
                  }

                  // Debug: Log select result
                  console.log("SELECT RESULT:", result);

                  if (result.length > 0) {
                    res.json({
                      status: "1",
                      payload: result[0],
                      message: msg_success,
                    });
                  } else {
                    res.json({
                      status: "0",
                      message: msg_invalidUser,
                    });
                  }
                }
              );
            } else {
              res.json({
                status: "0",
                message: msg_invalidUser,
              });
            }
          }
        );
      }
    );

    // Fallback: If no response was sent, send a generic error after a short delay
    setTimeout(() => {
      if (!res.headersSent) {
        res.status(500).json({ status: "0", message: "Unknown error" });
      }
    }, 1000);
  });

   // Add Employee
  app.post("/api/employee/add", (req, res) => {
    const reqObj = req.body;
    helper.CheckParameterValid(res, reqObj, ["name", "email", "password", "role"], () => {
      const authToken = helper.createRequestToken();
      db.query(
        "INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `auth_token`) VALUES (?, ?, ?, ?, 1, NOW(), ?)",
        [reqObj.name, reqObj.email, reqObj.password, reqObj.role, authToken],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          res.json({ status: "1", message: "Employee added successfully", id: result.insertId });
        }
      );
    });
  });

  // Get All Employees
  app.get("/api/employee/list", (req, res) => {
    db.query(
      "SELECT `user_id`, `name`, `email`, `role`, `is_active`, `created_at` FROM `users` WHERE `role` = 'employee'",
      [],
      (err, result) => {
        if (err) {
          helper.ThrowHtmlError(err, res);
          return;
        }
        res.json({ status: "1", payload: result });
      }
    );
  });

  // Update Employee
  app.put("/api/employee/update/:id", (req, res) => {
    const reqObj = req.body;
    const id = req.params.id;
    helper.CheckParameterValid(res, reqObj, ["name", "email", "role", "is_active"], () => {
      db.query(
        "UPDATE `users` SET `name`=?, `email`=?, `role`=?, `is_active`=? WHERE `user_id`=?",
        [reqObj.name, reqObj.email, reqObj.role, reqObj.is_active, id],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          res.json({ status: "1", message: "Employee updated successfully" });
        }
      );
    });
  });

  // Delete Employee
  app.delete("/api/employee/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query(
      "DELETE FROM `users` WHERE `user_id`=?",
      [id],
      (err, result) => {
        if (err) {
          helper.ThrowHtmlError(err, res);
          return;
        }
        res.json({ status: "1", message: "Employee deleted successfully" });
      }
    );
  });


   // Add IP
  app.post("/api/ip/add", (req, res) => {
    const reqObj = req.body;
    helper.CheckParameterValid(res, reqObj, ["ip_address", "description"], () => {
      db.query(
        "INSERT INTO `allowed_ips` (`ip_address`, `description`, `created_at`) VALUES (?, ?, NOW())",
        [reqObj.ip_address, reqObj.description],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          res.json({ status: "1", message: "IP added successfully", id: result.insertId });
        }
      );
    });
  });

  // Get All IPs
  app.get("/api/ip/list", (req, res) => {
    db.query(
      "SELECT `id`, `ip_address`, `description`, `created_at` FROM `allowed_ips` ORDER BY `created_at` DESC",
      [],
      (err, result) => {
        if (err) {
          helper.ThrowHtmlError(err, res);
          return;
        }
        res.json({ status: "1", payload: result });
      }
    );
  });

  // Delete IP
  app.delete("/api/ip/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query(
      "DELETE FROM `allowed_ips` WHERE `id`=?",
      [id],
      (err, result) => {
        if (err) {
          helper.ThrowHtmlError(err, res);
          return;
        }
        res.json({ status: "1", message: "IP deleted successfully" });
      }
    );
  });

// ========================== Attendance APIs =============================

  // Add a new attendance record
  app.post("/api/attendance/add", (req, res) => {
    var reqObj = req.body;
    helper.CheckParameterValid(res, reqObj, [
      "user_id", "username", "date", "status", "ip_address", "workingHours"
    ], () => {
      db.query(
        "INSERT INTO attendance_records (user_id, username, date, status, ip_address, workingHours, morning_check_in, morning_check_out, evening_check_in, evening_check_out) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          reqObj.user_id,
          reqObj.username,
          reqObj.date,
          reqObj.status,
          reqObj.ip_address,
          reqObj.workingHours,
          reqObj.morning_check_in || null,
          reqObj.morning_check_out || null,
          reqObj.evening_check_in || null,
          reqObj.evening_check_out || null
        ],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          res.json({
            status: "1",
            message: "Attendance record added successfully",
            id: result.insertId,
          });
        }
      );
    });
  });

  // Update an attendance record by ID
  app.put("/api/attendance/update/:id", (req, res) => {
    var reqObj = req.body;
    var id = req.params.id;
    helper.CheckParameterValid(res, reqObj, [
      "user_id", "username", "date", "status", "ip_address", "workingHours"
    ], () => {
      db.query(
        "UPDATE attendance_records SET user_id=?, username=?, date=?, status=?, ip_address=?, workingHours=?, morning_check_in=?, morning_check_out=?, evening_check_in=?, evening_check_out=? WHERE id=?",
        [
          reqObj.user_id,
          reqObj.username,
          reqObj.date,
          reqObj.status,
          reqObj.ip_address,
          reqObj.workingHours,
          reqObj.morning_check_in || null,
          reqObj.morning_check_out || null,
          reqObj.evening_check_in || null,
          reqObj.evening_check_out || null,
          id
        ],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          if (result.affectedRows > 0) {
            res.json({
              status: "1",
              message: "Attendance record updated successfully",
            });
          } else {
            res.json({ status: "0", message: "Attendance record not found" });
          }
        }
      );
    });
  });

  // Delete an attendance record by ID
  app.delete("/api/attendance/delete/:id", (req, res) => {
    db.query(
      "DELETE FROM attendance_records WHERE id=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          helper.ThrowHtmlError(err, res);
          return;
        }
        if (result.affectedRows > 0) {
          res.json({
            status: "1",
            message: "Attendance record deleted successfully",
          });
        } else {
          res.json({ status: "0", message: "Attendance record not found" });
        }
      }
    );
  });

  // List attendance records (optionally filter by user_id and/or date)
  app.get("/api/attendance/list", (req, res) => {
    let { user_id, date } = req.query;
    let sql = "SELECT id, user_id, username, date, status, ip_address, workingHours, morning_check_in, morning_check_out, evening_check_in, evening_check_out FROM attendance_records WHERE 1=1";
    let params = [];
    if (user_id) {
      sql += " AND user_id = ?";
      params.push(user_id);
    }
    if (date) {
      sql += " AND date = ?";
      params.push(date);
    }
    sql += " ORDER BY date DESC";
    db.query(sql, params, (err, results) => {
      if (err) {
        helper.ThrowHtmlError(err, res);
        return;
      }
      res.json({
        status: "1",
        payload: results,
      });
    });
  });

  // List attendance record for a user by user_id and current date
  app.get("/api/attendance/today/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const sql = "SELECT id, user_id, username, date, status, ip_address, workingHours, morning_check_in, morning_check_out, evening_check_in, evening_check_out FROM attendance_records WHERE user_id = ? AND date = ?";
    db.query(sql, [user_id, today], (err, results) => {
      if (err) {
        helper.ThrowHtmlError(err, res);
        return;
      }
      res.json({
        status: "1",
        payload: results,
      });
    });
  });

  // List all attendance records for a user by user_id
  app.get("/api/attendance/user/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    const sql = "SELECT id, user_id, username, date, status, ip_address, workingHours, morning_check_in, morning_check_out, evening_check_in, evening_check_out FROM attendance_records WHERE user_id = ? ORDER BY date DESC";
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        helper.ThrowHtmlError(err, res);
        return;
      }
      res.json({
        status: "1",
        payload: results,
      });
    });
  });

  // Trial status API
  const dayjs = require("dayjs");
  app.get("/api/trial-status", (req, res) => {
    // Prevent caching to avoid 304 responses
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    try {
      const startDateStr = process.env.TRIAL_START_DATE || "2025-06-12";
      const trialDays = parseInt(process.env.TRIAL_DURATION_DAYS || "60", 10);

      const now = dayjs();
      const startDate = dayjs(startDateStr);
      const expiryDate = startDate.add(trialDays, "day");

      if (!startDate.isValid() || !expiryDate.isValid()) {
        return res.status(500).json({
          error: "Trial date error",
          message: "Invalid trial start date or duration. Please check configuration.",
        });
      }

      if (now.isAfter(expiryDate)) {
        return res.status(403).json({
          error: "Trial expired",
          message: `Trial expired on ${expiryDate.format("YYYY-MM-DD")}. Please contact support.`,
          expired: true,
          expiryDate: expiryDate.format("YYYY-MM-DD"),
        });
      }

      res.status(200).json({
        success: true,
        message: "Trial active",
        expired: false,
        expiryDate: expiryDate.format("YYYY-MM-DD"),
        daysLeft: expiryDate.diff(now, "day"),
      });
    } catch (error) {
      res.status(500).json({ error: "Trial check failed", message: error.message });
    }
  });

// ========================== Device Fingerprints APIs =============================

  // Add a new device fingerprint
  app.post("/api/device-fingerprint/add", (req, res) => {
    const reqObj = req.body;
    helper.CheckParameterValid(res, reqObj, [
      "user_id", "fingerprints", "created_at", "status"
    ], () => {
      db.query(
        "INSERT INTO device_fingerprints (user_id, fingerprints, created_at, status) VALUES (?, ?, ?, ?)",
        [
          reqObj.user_id,
          reqObj.fingerprints,
          reqObj.created_at,
          reqObj.status
        ],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          res.json({
            status: "1",
            message: "Device fingerprint added successfully",
            device_id: result.insertId,
          });
        }
      );
    });
  });

  // Update a device fingerprint by device_id
  app.put("/api/device-fingerprint/update/:device_id", (req, res) => {
    const reqObj = req.body;
    const device_id = req.params.device_id;
    helper.CheckParameterValid(res, reqObj, [
      "user_id", "fingerprints", "created_at", "status"
    ], () => {
      db.query(
        "UPDATE device_fingerprints SET user_id=?, fingerprints=?, created_at=?, status=? WHERE device_id=?",
        [
          reqObj.user_id,
          reqObj.fingerprints,
          reqObj.created_at,
          reqObj.status,
          device_id
        ],
        (err, result) => {
          if (err) {
            helper.ThrowHtmlError(err, res);
            return;
          }
          if (result.affectedRows > 0) {
            res.json({
              status: "1",
              message: "Device fingerprint updated successfully",
            });
          } else {
            res.json({ status: "0", message: "Device fingerprint not found" });
          }
        }
      );
    });
  });

  // Delete a device fingerprint by device_id
  app.delete("/api/device-fingerprint/delete/:device_id", (req, res) => {
    const device_id = req.params.device_id;
    db.query(
      "DELETE FROM device_fingerprints WHERE device_id=?",
      [device_id],
      (err, result) => {
        if (err) {
          helper.ThrowHtmlError(err, res);
          return;
        }
        if (result.affectedRows > 0) {
          res.json({
            status: "1",
            message: "Device fingerprint deleted successfully",
          });
        } else {
          res.json({ status: "0", message: "Device fingerprint not found" });
        }
      }
    );
  });

  // Get all device fingerprints (optionally filter by user_id and/or status)
  app.get("/api/device-fingerprint/list", (req, res) => {
    const { user_id, status } = req.query;
    let sql = "SELECT device_id, user_id, fingerprints, created_at, status FROM device_fingerprints WHERE 1=1";
    let params = [];
    if (user_id) {
      sql += " AND user_id = ?";
      params.push(user_id);
    }
    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }
    sql += " ORDER BY device_id DESC";
    db.query(sql, params, (err, results) => {
      if (err) {
        helper.ThrowHtmlError(err, res);
        return;
      }
      res.json({
        status: "1",
        payload: results,
      });
    });
  });
};