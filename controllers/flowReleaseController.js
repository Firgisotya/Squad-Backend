const { sequelize } = require("../models");
const { iot_oci1 } = require("../config/connection");
const { iot_oci2 } = require("../config/connection");
const { iot_fsb } = require("../config/connection");

module.exports = {
  getFlowReleaseOCI1: async (req, res) => {
    try {
      let query;
      query = await iot_oci1.query(`
      SELECT 
      a.tgl,
      a.lotno,
      a.prod_order,
      a.product,
      UNIX_TIMESTAMP(date_format((a.prod_start),'%Y-%m-%d %H:%i:%s')) as prod_start,
      (
          select datediff(
              (select 
              IF(COUNT(id) = 0, now(), created_at) as created_at
                FROM tr_perilisan_h
                where prod_order = a.prod_order), from_unixtime(UNIX_TIMESTAMP(date_format((a.prod_start),'%Y-%m-%d %H:%i:%s'))) 
          )	
      ) as fg_quarantine,
      IF(SUM(mikro.simpulan) = 0, 7, 0) AS sim_mikro,
      IF(SUM(ipc.simpulan) = 0, 7, 0) AS sim_ipc,
      COUNT(inspeksi.id) AS inspeksi,
      COUNT(capa.id) AS capa,
      COUNT(form.id) as dynamic_form,
      SUM(ccp.total_jumlah) as ccp
  FROM 
      mst_prodidentity a
  LEFT JOIN 
      (
          SELECT
              lotno,
              CASE
                  WHEN (b.name = 'ALVIN JAUHAR AL KHOIR') THEN 0
                  ELSE -1
              END AS simpulan
          FROM
              tr_history2 a
          JOIN
              v_employee b ON a.job_owner = b.nik
          WHERE 
              a.tgl_proses IS NOT NULL AND b.name = 'ALVIN JAUHAR AL KHOIR'
      ) mikro ON a.lotno = mikro.lotno
  LEFT JOIN 
      (
          SELECT
              lotno,
              CASE
                  WHEN (b.name = 'HARY AGUSTIAWAN') THEN 0
                  ELSE -1
              END AS simpulan
          FROM
              tr_history2 a
          JOIN
              v_employee b ON a.job_owner = b.nik
          WHERE 
              a.tgl_proses IS NOT NULL AND b.name = 'HARY AGUSTIAWAN'
      ) ipc ON a.lotno = ipc.lotno
  LEFT JOIN 
      (
          SELECT
              id,
              pro,
              status_approval
          FROM
              aio_iot_oci1.tr_inspection_capa_h
          WHERE 
              status_approval >= 1
      ) inspeksi on a.prod_order = inspeksi.pro
  LEFT JOIN 
      (
          SELECT
              id,
              pro,
              status_approval
          FROM
              aio_iot_oci1.tr_inspection_capa_h
          WHERE 
              status_approval = 4
      ) capa on a.prod_order = capa.pro
  LEFT JOIN 
      (
          SELECT 
              id,
              lotno,
              pro
          FROM 
              tr_summary_perilisan
      ) form on a.lotno = form.lotno
  LEFT JOIN 
      (
          SELECT 
              prod_order1,
              SUM(jumlah) AS total_jumlah
          FROM 
              (
                  SELECT 
                      a.prod_order1,
                      IF(COUNT(a.id) > 1 AND 
                         ((c.product LIKE '%IW%' AND (TIA413 BETWEEN 103 AND 107)) OR 
                          (c.product NOT LIKE '%IW%' AND (TIA413 BETWEEN 108 AND 112))), 1, 0) AS jumlah
                  FROM 
                      scada_db1.ppi_ilbfiller1 a
                  INNER JOIN 
                      aio_iot_oci1.mst_prodidentity c ON a.prod_order1 = c.prod_order
                  GROUP BY 
                      prod_order1
  
                  UNION
  
                  SELECT 
                      pif.prod_order1,
                      IF(COUNT(pif.id) > 1, 1, 0) AS jumlah
                  FROM 
                      scada_db1.ppi_ilbfiller1 pif
                  WHERE 
                      (
                          (FICA411 > 17952 OR FICA411 < 10772)
                          OR 
                          (FICA411 > 22609 OR FICA411 < 13566)
                          OR 
                          (FICA411 > 30011.01 OR FICA411 < 18006.61)
                      )
                  GROUP BY 
                      pif.prod_order1
  
                  union
  
                  SELECT 
                      cpaf.prod_order1,
                      IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
                  from 
                      scada_db1.cttn_prod_area_filling1 cpaf
                  where 
                      cpaf.Pressure_Filling_Chamber < 1
                  GROUP BY 
                      cpaf.prod_order1
  
                  union
  
                  SELECT 
                      cpaf.prod_order1,
                      IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
                  from 
                      scada_db1.cttn_prod_area_filling1 cpaf
                  where 
                      cpaf.Pressure_Transfer_Table < 1
                  GROUP BY 
                      cpaf.prod_order1
  
                  union
  
                  SELECT 
                      cpaf.prod_order1,
                      IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
                  from 
                      scada_db1.cttn_prod_area_filling1 cpaf
                  where 
                      cpaf.Pressure_Cap_Cool < 1
                  GROUP BY 
                      cpaf.prod_order1
  
                  union
  
                  SELECT 
                      cpaf.prod_order1,
                      IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
                  from 
                      scada_db1.cttn_prod_area_filling1 cpaf
                  where 
                      cpaf.Pressure_Cap_Steam < 1
                  GROUP BY 
                      cpaf.prod_order1
  
                  union
  
                  SELECT 
                      cpaf.prod_order1,
                      IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
                  from 
                      scada_db1.cttn_prod_area_filling1 cpaf
                  where 
                      cpaf.Rotary_Speed > 49.5
                  GROUP BY 
                      cpaf.prod_order1
  
                  union
  
                  SELECT 
                      cpaf.prod_order1,
                      IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
                  from 
                      scada_db1.cttn_prod_area_filling1 cpaf
                  where 
                      cpaf.Press_Steam < 100 OR cpaf.Press_Steam > 150
                  GROUP BY 
                      cpaf.prod_order1
  
              ) combined_data
          GROUP BY 
              prod_order1
  
      ) ccp on a.prod_order = ccp.prod_order1
  WHERE date_format(a.tgl, '%Y') = '2023'
  GROUP BY a.tgl, a.lotno, a.prod_order, a.product, a.prod_start
  ORDER BY a.tgl DESC
  LIMIT 24
            `);
      res.status(200).send({
        message: "Get data success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
        data: [],
      });
    }
  },

  getFlowReleaseOCI2: async (req, res) => {
    try {
      let query;
      query = await iot_oci2.query(`
            select 
a.tgl,
a.lotno,
a.prod_order,
a.product,
UNIX_TIMESTAMP(date_format((a.prod_start),'%Y-%m-%d %H:%i:%s')) as prod_start,
(
    select datediff(
        (select 
        IF(COUNT(id) = 0, now(), created_at) as created_at
          FROM tr_perilisan_h
          where prod_order = a.prod_order), from_unixtime(UNIX_TIMESTAMP(date_format((a.prod_start),'%Y-%m-%d %H:%i:%s'))) 
    )	
) as fg_quarantine,
IF(SUM(mikro.simpulan) = 0, 7, 0) AS sim_mikro,
IF(SUM(ipc.simpulan) = 0, 7, 0) AS sim_ipc,
COUNT(inspeksi.id) AS inspeksi,
COUNT(capa.id) AS capa,
count(form.id) as dynamic_form,
SUM(ccp.total_jumlah) as ccp
from mst_prodidentity a
LEFT JOIN 
    (
        SELECT
            lotno,
            CASE
                WHEN (b.name = 'ALVIN JAUHAR AL KHOIR') THEN 0
                ELSE -1
            END AS simpulan
        FROM
        aio_iot_oci1.tr_history2 a
        JOIN
        aio_iot_oci1.v_employee b ON a.job_owner = b.nik
        WHERE 
            a.tgl_proses IS NOT NULL AND b.name = 'ALVIN JAUHAR AL KHOIR'
    ) mikro ON a.lotno = mikro.lotno
LEFT JOIN 
    (
        SELECT
            lotno,
            CASE
                WHEN (b.name = 'HARY AGUSTIAWAN') THEN 0
                ELSE -1
            END AS simpulan
        FROM
        aio_iot_oci1.tr_history2 a
        JOIN
        aio_iot_oci1.v_employee b ON a.job_owner = b.nik
        WHERE 
            a.tgl_proses IS NOT NULL AND b.name = 'HARY AGUSTIAWAN'
    ) ipc ON a.lotno = ipc.lotno
left join 
	(
		select
			id,
			pro,
			status_approval
		from
			aio_iot_oci1.tr_inspection_capa_h
		where 
			status_approval >= 1
	) inspeksi on a.prod_order = inspeksi.pro
left join 
	(
		select
			id,
			pro,
			status_approval
		from
			aio_iot_oci1.tr_inspection_capa_h
		where 
			status_approval = 4
	) capa on a.prod_order = capa.pro
left join 
	(
		select 
			id,
			lotno,
			pro
		from 
			tr_summary_perilisan
) form on a.lotno = form.lotno
left join 
	(
		SELECT 
    prod_order2,
    SUM(jumlah) AS total_jumlah
FROM 
    (
        SELECT 
            a.prod_order2,
            IF(COUNT(a.id) > 1 AND 
               ((c.product LIKE '%IW%' AND (TIA413 BETWEEN 103 AND 107)) OR 
                (c.product NOT LIKE '%IW%' AND (TIA413 BETWEEN 108 AND 112))), 1, 0) AS jumlah
        FROM 
            scada_db1.ppi_ilbfiller2 a
        INNER JOIN 
            aio_iot_oci1.mst_prodidentity c ON a.prod_order2 = c.prod_order
        GROUP BY 
            prod_order2

        UNION

        SELECT 
            pif.prod_order2,
            IF(COUNT(pif.id) > 1, 1, 0) AS jumlah
        FROM 
            scada_db1.ppi_ilbfiller2 pif
        WHERE 
    		(
        		(FICA411 > 17952 OR FICA411 < 10772)
        	OR 
        		(FICA411 > 22609 OR FICA411 < 13566)
        	OR 
        		(FICA411 > 30011.01 OR FICA411 < 18006.61)
    		)

        GROUP BY 
            pif.prod_order2
            
        union
        
        SELECT 
        	cpaf.prod_order2,
        	IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
        from 
        	scada_db1.cttn_prod_area_filling2 cpaf
        where 
        	cpaf.Pressure_Filling_Chamber < 1
        GROUP BY 
            cpaf.prod_order2
        
         union
        
        SELECT 
        	cpaf.prod_order2,
        	IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
        from 
        	scada_db1.cttn_prod_area_filling2 cpaf
        where 
        	cpaf.Pressure_Transfer_Table < 1
        GROUP BY 
            cpaf.prod_order2
            
        union
        
        SELECT 
        	cpaf.prod_order2,
        	IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
        from 
        	scada_db1.cttn_prod_area_filling2 cpaf
        where 
        	cpaf.Pressure_Cap_Cool < 1
        GROUP BY 
            cpaf.prod_order2
        
        union
        
        SELECT 
        	cpaf.prod_order2,
        	IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
        from 
        	scada_db1.cttn_prod_area_filling2 cpaf
        where 
        	cpaf.Pressure_Cap_Steam < 1
        GROUP BY 
            cpaf.prod_order2
            
        union
        
        SELECT 
        	cpaf.prod_order2,
        	IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
        from 
        	scada_db1.cttn_prod_area_filling2 cpaf
        where 
        	cpaf.Rotary_Speed > 49.5
        GROUP BY 
            cpaf.prod_order2
            
        union
        
        SELECT 
        	cpaf.prod_order2,
        	IF(COUNT(cpaf.id)>1, 1, 0) AS jumlah
        from 
        	scada_db1.cttn_prod_area_filling2 cpaf
        where 
        	cpaf.Press_Steam < 100 OR cpaf.Press_Steam > 150
        GROUP BY 
            cpaf.prod_order2
            
            
    ) combined_data
GROUP BY 
    prod_order2

		
	) ccp on a.prod_order = ccp.prod_order2
where date_format(a.tgl, '%Y') = '2023'
group by a.lotno
order by a.tgl DESC
limit 24
            `);
      res.status(200).send({
        message: "Get data success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
        data: [],
      });
    }
  },

  getFlowReleaseFSB: async (req, res) => {
    try {
        let query = await iot_fsb.query(`
    SELECT 
    mp.tgl,
    mp.lotno,
    mp.prod_order,
    mcs.product,
    UNIX_TIMESTAMP(date_format((mp.prod_start),'%Y-%m-%d %H:%i:%s')) as prod_start,
    if(UNIX_TIMESTAMP(DATE_FORMAT((cppbc.temp_z1_stop_),'%Y-%m-%d %H:%i:%s')) IS null,  
    UNIX_TIMESTAMP(NOW()), UNIX_TIMESTAMP(date_format((cppbc.temp_z1_stop_),'%Y-%m-%d %H:%i:%s'))) as end_prod,
    (
        select datediff(
            (select 
            IF(COUNT(id) = 0, now(), created_at) as created_at
              FROM tr_perilisan_h
              where prod_order = mp.prod_order), from_unixtime(UNIX_TIMESTAMP(date_format((mp.prod_start),'%Y-%m-%d %H:%i:%s'))) 
        )	
    ) as fg_quarantine,
    (
        SELECT MAX(x.min)
        FROM mst_ccp_standart x
        WHERE x.item = 'ccp_Temp_Z1_Up' AND x.product = mp.product
    ) AS ccp_Temp_Z1_Up,
    (
        SELECT MAX(x.min)
        FROM mst_ccp_standart x
        WHERE x.item = 'ccp_Temp_Z1_Down' AND x.product = mp.product
    ) AS ccp_Temp_Z1_Down,
    (
        SELECT MAX(x.min)
        FROM mst_ccp_standart x
        WHERE x.item = 'ccp_speed_cv' AND x.product = mp.product
    ) AS ccp_speed_cv,
    ccp.ccp as ccp,
    form.ppi_fsb as dynamic_form,
    ipc.IPC as sim_ipc,
    mikro.status_mikro as sim_mikro,
    inspeksi.inspeksi as inspeksi,
    capa.capa as capa
FROM 
    mst_prodidentity mp
left join 13_catatan_proses_produksi_baking_cool cppbc on mp.prod_order = cppbc.pro
CROSS JOIN mst_ccp_standart mcs ON mp.product = mcs.product
left join 
	(
		select 
			prod_order_fsb,
        	sum(ccp) as ccp
        from 
        	(
        		select a.prod_order_fsb, IF(COUNT(IF(a.ccp_speed_cv > ccp_speed_cv, 1, NULL)) > 1, 1, 0) AS 'ccp'
        FROM scada_db1.cttn_ccpfsb a
        where a.ccp_speed_cv != 0
        group by a.prod_order_fsb
        union
        select b.prod_order_fsb, IF(COUNT(IF(b.ccp_Temp_Z1_Up < ccp_Temp_Z1_Up, 1, NULL)) > 1, 1, 0) AS 'ccp'
		FROM scada_db1.cttn_ccpfsb b
		where b.ccp_Temp_Z1_Up != 0
		group by b.prod_order_fsb
		union
		select c.prod_order_fsb, IF(COUNT(IF(c.ccp_Temp_Z1_Down < ccp_Temp_Z1_Down, 1, NULL)) > 1, 1, 0) AS 'ccp'
		FROM scada_db1.cttn_ccpfsb c
		where c.ccp_Temp_Z1_Down != 0
		group by c.prod_order_fsb
        	) combine
        group by 
        	prod_order_fsb
	) ccp on mp.prod_order = ccp.prod_order_fsb
left join 
	(
		select pro, count(id) as ppi_fsb 
		from tr_summary_perilisan
		group by pro
	) form on mp.prod_order = form.pro
left join
	(
		SELECT pro,
		(s_berat_baking + s_berat_forming +  s_dimensi_baking + s_moisture + s_reject_xray + s_pillow_seal + s_finish_good) AS 'IPC'
		FROM lims_fsb.v_simpulan_ipc
		group by pro
	) ipc on mp.prod_order = ipc.pro
left join 
	(
		SELECT pro,
		status_approve as status_mikro
		FROM lims_fsb.tr_micro_h
		group by pro
	) mikro on mp.prod_order = mikro.pro
left join 
	(
		select
		pro,
		COUNT(id) AS inspeksi
		FROM aio_iot_fsb.tr_inspection_capa_h
		where status_approval >= 1
		group by pro
	) inspeksi on mp.prod_order = inspeksi.pro
left join
	(
		SELECT
		pro,
		COUNT(id) AS capa
		FROM aio_iot_fsb.tr_inspection_capa_h
		WHERE status_approval = 4
		group by pro
	) capa on mp.prod_order = capa.pro
GROUP BY mp.prod_order
order by mp.tgl desc
limit 24
    `);

    res.status(200).send({
      message: "Get data success",
      data: query[0],
    });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Get data failed",
          data: [],
        });
    }
  },

  grafikRelease: async (req, res) => {
    try {
        let oci1, oci2, fsb;
        const { startDate, endDate } = req.body;
        console.log(startDate, endDate);
        if (startDate && endDate) {
            // oci1
            oci1 = await iot_oci1.query(`
            select 
	lotno,
	prod_order,
	product,
	date_format(prod_start, '%Y-%m-%d') as tanggal, 
	datediff(
		if(count(id) = 0, now(), created_at), from_unixtime(UNIX_TIMESTAMP(date_format((prod_start),'%Y-%m-%d %H:%i:%s')))
	) as day_release
	from tr_perilisan_h 
	where date_format(prod_start, '%Y-%m-%d') >= '${startDate}' and date_format(prod_start, '%Y-%m-%d') <= '${endDate}'
	group by prod_order
	order by date_format(prod_start, '%Y-%m-%d') desc
	
            `);

        // oci2
        oci2 = await iot_oci2.query(`
        select 
        lotno,
        prod_order,
        product,
        date_format(prod_start, '%Y-%m-%d') as tanggal, 
        datediff(
            if(count(id) = 0, now(), created_at), from_unixtime(UNIX_TIMESTAMP(date_format((prod_start),'%Y-%m-%d %H:%i:%s')))
        ) as day_release
        from tr_perilisan_h 
        where date_format(prod_start, '%Y-%m-%d') >= '${startDate}' and date_format(prod_start, '%Y-%m-%d') <= '${endDate}'
        group by prod_order
        order by date_format(prod_start, '%Y-%m-%d') desc
            `);

        // fsb
        fsb = await iot_fsb.query(`
        select 
        lotno,
        prod_order,
        product,
        date_format(prod_start, '%Y-%m-%d') as tanggal, 
        datediff(
            if(count(id) = 0, now(), created_at), from_unixtime(UNIX_TIMESTAMP(date_format((prod_start),'%Y-%m-%d %H:%i:%s')))
        ) as day_release
        from tr_perilisan_h 
        where date_format(prod_start, '%Y-%m-%d') >= '${startDate}' and date_format(prod_start, '%Y-%m-%d') <= '${endDate}'
        group by prod_order
        order by date_format(prod_start, '%Y-%m-%d') desc
            `);
        }
        else {
             // oci1
             oci1 = await iot_oci1.query(`
             select 
	lotno,
	prod_order,
	product,
	date_format(prod_start, '%Y-%m-%d') as tanggal, 
	datediff(
		if(count(id) = 0, now(), created_at), from_unixtime(UNIX_TIMESTAMP(date_format((prod_start),'%Y-%m-%d %H:%i:%s')))
	) as day_release
	from tr_perilisan_h
	group by prod_order 
	order by prod_start desc 
	limit 20
             `);
 
         // oci2
         oci2 = await iot_oci2.query(`
         select 
         lotno,
         prod_order,
         product,
         date_format(prod_start, '%Y-%m-%d') as tanggal, 
         datediff(
             if(count(id) = 0, now(), created_at), from_unixtime(UNIX_TIMESTAMP(date_format((prod_start),'%Y-%m-%d %H:%i:%s')))
         ) as day_release
         from tr_perilisan_h
         group by prod_order 
         order by prod_start desc 
         limit 20
             `);
 
         // fsb
         fsb = await iot_fsb.query(`
         select 
         lotno,
         prod_order,
         product,
         date_format(prod_start, '%Y-%m-%d') as tanggal, 
         datediff(
             if(count(id) = 0, now(), created_at), from_unixtime(UNIX_TIMESTAMP(date_format((prod_start),'%Y-%m-%d %H:%i:%s')))
         ) as day_release
         from tr_perilisan_h
         group by prod_order 
         order by prod_start desc 
         limit 20
             `);
        }

        res.status(200).send({
            message: "Get data success",
            data: {
                oci1: oci1[0],
                oci2: oci2[0],
                fsb: fsb[0]
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Get data failed",
          data: [],
        });
    }
  }


};
